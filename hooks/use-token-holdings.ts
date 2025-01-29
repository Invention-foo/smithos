import { useState, useEffect } from "react";
import Moralis from "moralis";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds


export interface Token {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  usdPrice: number;
  usdValue: number;
  priceChange24h: number;
  valueChange24h: number;
  portfolioPercentage: number;
  isNative: boolean;
  status: "green" | "yellow" | "red";
}

export function useTokenHoldings() {
  const { address } = useAppKitAccount();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { caipNetworkId } = useAppKitNetwork();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!address || !caipNetworkId) {
        setTokens([]);
        setIsLoading(false);
        return;
      }

      const cachedData = localStorage.getItem(`tokenHoldings-${address}`);
      if (cachedData) {
        const { tokens: cachedTokens, timestamp } = JSON.parse(cachedData);
        const now = new Date().getTime();
        
        if (now - timestamp < ONE_HOUR) {
          setTokens(cachedTokens);
          setIsLoading(false);
          return;
        }
      }

      try {
        let formattedTokens: Token[] = [];

        if (caipNetworkId.startsWith('eip155')) {
          const chainId = caipNetworkId.split(':')[1];
          const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
            address: address,
            chain: chainId,
            excludeSpam: true,
            limit: 10,
            excludeUnverifiedContracts: true,
          });

          formattedTokens = response.result.map((token) => ({
            symbol: token.symbol || "Unknown",
            name: token.name || "Unknown Token",
            balance: token.balance?.toString() || "0",
            balanceFormatted: token.balanceFormatted || "0",
            usdPrice: 0,
            usdValue: 0,
            priceChange24h: 0,
            valueChange24h: 0,
            portfolioPercentage: 0,
            isNative: false,
            status: "yellow"
          }));
        } else if (caipNetworkId.startsWith('solana')) {
          const response = await Moralis.SolApi.account.getSPL({
            address: address,
            network: "mainnet"
          });

          formattedTokens = response.result.map(token => ({
            symbol: token.symbol || "Unknown",
            name: token.name || "Unknown Token",
            balance: token.amount?.toString() || "0",
            balanceFormatted: token.amount?.toString() || "0",
            usdPrice: 0,
            usdValue: 0,
            priceChange24h: 0,
            valueChange24h: 0,
            portfolioPercentage: 0,
            isNative: false,
            status: "yellow"
          }));
        }

        // Store tokens with timestamp
        const cacheData = {
          tokens: formattedTokens,
          timestamp: new Date().getTime()
        };
        localStorage.setItem(`tokenHoldings-${address}`, JSON.stringify(cacheData));
        
        setTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setError(error as Error);
        setTokens([]);
        localStorage.removeItem(`tokenHoldings-${address}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [address, caipNetworkId]);

  const clearTokenHoldings = () => {
    setTokens([]);
    if (address) {
      localStorage.removeItem(`tokenHoldings-${address}`);
    }
  };

  return { tokens, isLoading, error, clearTokenHoldings };
}
