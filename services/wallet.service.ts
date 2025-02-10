import Moralis from "moralis";
import { SIWXSession } from "@reown/appkit-core";
import { supabase } from "../lib/supabase";
import type { Transaction, Token } from "../types/wallet";
import { updateOrGetTokenSecurityStatus } from "@/lib/token-security";
import { batchAuditContracts } from "./contract-audit";

export class WalletService {
  private static instance: WalletService;
  private readonly STORAGE_PREFIX = 'wallet';

  private constructor() {}

  static getInstance(): WalletService {
    if (!this.instance) {
      this.instance = new WalletService();
      Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      });
    }
    return this.instance;
  }

  // SIWX Methods
  async verifyAndStoreSession(session: SIWXSession): Promise<void> {
    try {
      const {
        data: { accountAddress },
        signature,
        data: { nonce, chainId },
      } = session;
      
      const verificationResult = await this.verifySignature(
        accountAddress,
        signature,
        nonce
      );

      if (!verificationResult.success) {
        throw new Error(verificationResult.message || "Verification failed");
      }

      await this.createSupabaseSession();
      await this.upsertWalletUser(accountAddress, chainId);
      this.storeSession(session);
    } catch (error) {
      console.error("Session storage error:", error);
      throw error;
    }
  }

  // Transaction Methods
  async fetchAndCacheTransactions(address: string, caipNetworkId: string): Promise<Transaction[]> {
    const cacheKey = `${this.STORAGE_PREFIX}-transactions-${address}-${caipNetworkId}`;
    
    try {
      if (caipNetworkId.startsWith("eip155")) {
        const chainId = caipNetworkId.split(":")[1];
        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
          address,
          chain: chainId,
          limit: 100
        });

        const transactions = this.formatTransactions(response.result, address);
        localStorage.setItem(cacheKey, JSON.stringify(transactions));
        return transactions;
      }
      return [];
    } catch (error) {
      localStorage.removeItem(cacheKey);
      throw error;
    }
  }

  getStoredTransactions(address: string, caipNetworkId: string): Transaction[] | null {
    const cacheKey = `${this.STORAGE_PREFIX}-transactions-${address}-${caipNetworkId}`;
    const stored = localStorage.getItem(cacheKey);
    return stored ? JSON.parse(stored) : null;
  }

  clearStoredTransactions(address: string, caipNetworkId: string): void {
    const cacheKey = `${this.STORAGE_PREFIX}-transactions-${address}-${caipNetworkId}`;
    localStorage.removeItem(cacheKey);
  }

  // Token Methods
  async fetchAndCacheTokens(address: string, caipNetworkId: string): Promise<Token[]> {
    const cacheKey = `${this.STORAGE_PREFIX}-tokens-${address}-${caipNetworkId}`;
    
    try {
      let formattedTokens: Token[] = [];

      if (caipNetworkId.startsWith("eip155")) {
        const chainId = caipNetworkId.split(":")[1];
        const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          address: address,
          chain: chainId,
          excludeSpam: true,
          limit: 10,
          excludeUnverifiedContracts: true,
          maxTokenInactivity: 30,
        });

        const tokenAddresses = response.result.map(token => token.tokenAddress?.toJSON());
        const securityStatuses = await updateOrGetTokenSecurityStatus(tokenAddresses as string[], chainId);

        const blockchain = caipNetworkId.startsWith("eip155") ? "ethereum" : "base";
        const contracts = tokenAddresses.map(tokenAddress => ({
          address: tokenAddress as string,
          blockchain: blockchain
        }));
        const codeseerAudits = await batchAuditContracts(contracts, address, chainId);

        formattedTokens = this.formatEvmTokens(response.result, securityStatuses, codeseerAudits);
      } else if (caipNetworkId.startsWith("solana")) {
        formattedTokens = await this.fetchSolanaTokens(address);
      }

      localStorage.setItem(cacheKey, JSON.stringify(formattedTokens));
      return formattedTokens;
    } catch (error) {
      localStorage.removeItem(cacheKey);
      throw error;
    }
  }

  getStoredTokens(address: string, caipNetworkId: string): Token[] | null {
    const cacheKey = `${this.STORAGE_PREFIX}-tokens-${address}-${caipNetworkId}`;
    const stored = localStorage.getItem(cacheKey);
    return stored ? JSON.parse(stored) : null;
  }

  clearStoredTokens(address: string, caipNetworkId: string): void {
    const cacheKey = `${this.STORAGE_PREFIX}-tokens-${address}-${caipNetworkId}`;
    localStorage.removeItem(cacheKey);
  }

  // Private helper methods
  private async verifySignature(
    walletAddress: string,
    signature: string,
    nonce: string,
  ) {
    const response = await fetch("/api/verifySignature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, signature, nonce }),
    });
    return await response.json();
  }

  private async createSupabaseSession() {
    const { data: authSession, error: authError } = 
      await supabase.auth.signInAnonymously();
    if (authError || !authSession) {
      throw new Error("Failed to create auth session");
    }
  }

  private async upsertWalletUser(accountAddress: string, chainId: string) {
    const { error } = await supabase.from("smith_users").upsert(
      {
        wallet_address: accountAddress,
        wallet_provider: chainId,
      },
      { onConflict: "wallet_address" }
    );
    if (error) {
      console.error("Error upserting wallet address:", error.message);
    }
  }

  private storeSession(session: SIWXSession) {
    localStorage.setItem(`${this.STORAGE_PREFIX}-session`, JSON.stringify(session));
  }

  private formatTransactions(txs: any[], address: string): Transaction[] {
    const formattedTransactions = txs.map(tx => ({
      date: new Date(tx.blockTimestamp).toISOString().split('T')[0],
      value: tx.value,
      type: tx.from.lowercase === address.toLowerCase() ? 'Sent' : 'Received',
      hash: tx.hash
    }));

    // Group and sort transactions
    const txsByDate = this.groupTransactionsByDate(formattedTransactions);
    return this.sortTransactions(txsByDate);
  }

  private groupTransactionsByDate(transactions: Transaction[]) {
    return transactions.reduce((acc, tx) => {
      const date = tx.date;
      if (!acc[date]) {
        acc[date] = {
          volume: 0,
          transactions: []
        };
      }
      const value = Number(tx.value) / 1e18;
      acc[date].volume += value;
      acc[date].transactions.push(tx);
      return acc;
    }, {} as Record<string, {volume: number, transactions: any[]}>);
  }

  private sortTransactions(txsByDate: Record<string, {volume: number, transactions: any[]}>) {
    return Object.entries(txsByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .flatMap(([date, data]) => 
        data.transactions.map((tx: any) => ({
          date,
          value: tx.value,
          type: tx.type,
          hash: tx.hash
        }))
      );
  }

  private formatEvmTokens(tokens: any[], securityStatuses: any, codeseerAudits: any): Token[] {
    return tokens
      .filter(token => Number(token.usdValue) > 0.01)
      .map((token): Token => {
        const tokenAddress = token.tokenAddress?.toJSON();
        const codeseerAudit = tokenAddress ? codeseerAudits[tokenAddress.toLowerCase()] : undefined;
        
        return {
          symbol: token.symbol || "Unknown",
          name: token.name || "Unknown Token",
          balance: token.balance?.toString(),
          balanceFormatted: token.balanceFormatted,
          usdPrice: Number(token.usdPrice),
          usdValue: Number(token.usdValue),
          price24hrPercentChange: Number(token.usdPrice24hrPercentChange),
          status: securityStatuses?.[tokenAddress as string]?.status || 'unknown',
          audit_report: securityStatuses?.[tokenAddress as string]?.audit_report || 'unknown',
          codeseerAudit: codeseerAudit && !codeseerAudit.error ? {
            riskAssessment: codeseerAudit.riskAssessment?.summary,
            maliciousPatterns: codeseerAudit.maliciousPatterns?.length || 0,
            commonality: codeseerAudit.riskAssessment?.commonality?.description,
            severity: codeseerAudit.codeAudit?.reduce((acc: number, curr: any) => acc + (curr.severity === 'high' ? 1 : 0), 0),
          } : undefined
        };
      })
      .sort((a, b) => Number(b.usdValue) - Number(a.usdValue));
  }

  private async fetchSolanaTokens(address: string): Promise<Token[]> {
    const response = await Moralis.SolApi.account.getSPL({
      address: address,
      network: "mainnet",
    });
    
    const solPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const solPriceData = await solPriceResponse.json();
    const solUsdPrice = solPriceData.solana.usd;
    
    return response.result
      .map((token): Token => {
        const balance = Number(token.amount.solana);
        const usdValue = balance * solUsdPrice;
        
        return {
          symbol: token.symbol || "Unknown",
          name: token.name || "Unknown Token",
          balance: token.amount.lamports?.toString(),
          balanceFormatted: token.amount.solana?.toString(),
          usdPrice: solUsdPrice,
          usdValue: usdValue
        };
      })
      .filter(token => (token.usdValue ?? 0) > 0.001)
      .sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));
  }
}

export const walletService = WalletService.getInstance(); 