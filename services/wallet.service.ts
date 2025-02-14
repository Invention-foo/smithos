import Moralis from "moralis";
import { SIWXSession } from "@reown/appkit-core";
import { supabase } from "../lib/supabase";
import type { Transaction, Token, Pnl } from "../types/wallet";
import { updateOrGetTokenSecurityStatus } from "@/lib/token-security";
import { batchAuditContracts } from "./contract-audit";
import { getBlockchainFromChainId } from "@/lib/wallet";

export class WalletService {
  private static instance: WalletService;
  private readonly STORAGE_PREFIX = 'wallet';
  private readonly STORAGE_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

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
        const ethResponse = await Moralis.EvmApi.transaction.getWalletTransactions({
          address,
          chain: chainId,
          fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          toDate: new Date().toISOString(),
          limit: 20
        });
        const erc20Response = await Moralis.EvmApi.token.getWalletTokenTransfers({
          address,
          chain: chainId,
          fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          toDate: new Date().toISOString(),
          limit: 20
        });

        
        const ethTransactions = this.formatTransactions(ethResponse.toJSON().result, address, 'eth');
        const erc20Transactions = this.formatTransactions(erc20Response.toJSON().result, address, 'erc20');
        const allTransactions = [...ethTransactions, ...erc20Transactions]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const cacheData = { data: allTransactions, expiry: Date.now() + this.STORAGE_TIMEOUT };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        return allTransactions;
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
    if (stored) {
      const cacheData = JSON.parse(stored);
      if (cacheData.expiry > Date.now()) {
        return cacheData.data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  clearStoredTransactions(address: string, caipNetworkId: string): void {
    const cacheKey = `${this.STORAGE_PREFIX}-transactions-${address}-${caipNetworkId}`;
    localStorage.removeItem(cacheKey);
  }

  // Wallet PnL Methods
  async fetchAndCachePnl(address: string, caipNetworkId: string): Promise<Pnl | null> {
    const cacheKey = `${this.STORAGE_PREFIX}-pnl-${address}-${caipNetworkId}`;
    try {
      if (caipNetworkId.startsWith("eip155")) {
        const chainId = caipNetworkId.split(":")[1];
        const response = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({
          address,
          chain: chainId,
        });
        const pnl = response.result;
        const cacheData = { data: pnl, expiry: Date.now() + this.STORAGE_TIMEOUT };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        return pnl as Pnl;
      }
      return null;
    } catch (error) {
      localStorage.removeItem(cacheKey);
      throw error;
    }
  }

  getStoredPnl(address: string, caipNetworkId: string): Pnl | null {
    const cacheKey = `${this.STORAGE_PREFIX}-pnl-${address}-${caipNetworkId}`;
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      const cacheData = JSON.parse(stored);
      if (cacheData.expiry > Date.now()) {
        return cacheData.data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  clearStoredPnl(address: string, caipNetworkId: string): void {
    const cacheKey = `${this.STORAGE_PREFIX}-pnl-${address}-${caipNetworkId}`;
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

        const blockchain = getBlockchainFromChainId(chainId);
        const contracts = tokenAddresses.map(tokenAddress => ({
          address: tokenAddress as string,
          blockchain: blockchain
        }));
        const codeseerAudits = await batchAuditContracts(contracts, address, chainId);

        formattedTokens = this.formatEvmTokens(response.result, securityStatuses, codeseerAudits);
      } 
      // else if (caipNetworkId.startsWith("solana")) {
      //   formattedTokens = await this.fetchSolanaTokens(address);
      // }

      const cacheData = { data: formattedTokens, expiry: Date.now() + this.STORAGE_TIMEOUT };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      return formattedTokens;
    } catch (error) {
      localStorage.removeItem(cacheKey);
      throw error;
    }
  }

  getStoredTokens(address: string, caipNetworkId: string): Token[] | null {
    const cacheKey = `${this.STORAGE_PREFIX}-tokens-${address}-${caipNetworkId}`;
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      const cacheData = JSON.parse(stored);
      if (cacheData.expiry > Date.now()) {
        return cacheData.data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
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

  private formatTransactions(txs: any[], address: string, type: 'eth' | 'erc20'): Transaction[] {
    let formattedTransactions: Transaction[] = [];

    // https://docs.moralis.com/web3-data-api/evm/reference/get-wallet-transactions
    if (type === 'eth') {
      formattedTransactions = txs.map(tx => ({
        timestamp: new Date(tx.block_timestamp).toISOString(),
        value: (tx.value / Math.pow(10, 18)).toString(),
        direction: tx.from_address === address ? 'Sent' : 'Received',
        hash: tx.hash,
        tokenName: "Ethereum",
        tokenSymbol: "ETH",
        type
      }))
    } 
    // https://docs.moralis.com/web3-data-api/evm/reference/get-wallet-token-transfers
    else if (type === 'erc20') {
      formattedTransactions = txs.map(tx => ({
        timestamp: new Date(tx.block_timestamp).toISOString(),
        value: (tx.value / Math.pow(10, tx.token_decimals)).toString(),
        direction: tx.from_address === address ? 'Sent' : 'Received',
        hash: tx.transaction_hash,
        tokenName: tx.token_name,
        tokenSymbol: tx.token_symbol,
        type
      }))
    }
    return formattedTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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

  private async getEthUsdPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const ethPriceData = await response.json();
    const ethUsdPrice = ethPriceData.ethereum.usd;
    return ethUsdPrice;
  }

  // private async fetchSolanaTokens(address: string): Promise<Token[]> {
  //   const response = await Moralis.SolApi.account.getSPL({
  //     address: address,
  //     network: "mainnet",
  //   });
    
  //   const solPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
  //   const solPriceData = await solPriceResponse.json();
  //   const solUsdPrice = solPriceData.solana.usd;
    
  //   return response.result
  //     .map((token): Token => {
  //       const balance = Number(token.amount.solana);
  //       const usdValue = balance * solUsdPrice;
        
  //       return {
  //         symbol: token.symbol || "Unknown",
  //         name: token.name || "Unknown Token",
  //         balance: token.amount.lamports?.toString(),
  //         balanceFormatted: token.amount.solana?.toString(),
  //         usdPrice: solUsdPrice,
  //         usdValue: usdValue
  //       };
  //     })
  //     .filter(token => (token.usdValue ?? 0) > 0.001)
  //     .sort((a, b) => (b.usdValue ?? 0) - (a.usdValue ?? 0));
  // }
}

export const walletService = WalletService.getInstance(); 