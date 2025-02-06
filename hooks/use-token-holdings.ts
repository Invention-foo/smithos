import { useState, useEffect } from "react";
import Moralis from "moralis";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { updateOrGetTokenSecurityStatus } from "@/lib/token-security";

// address: '0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511', ETH: to test
// address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", SOL: to test

Moralis.start({
  apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
});

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  usdPrice?: number;
  usdValue?: number;
  status?: string;
  audit_report?: string;
  price24hrPercentChange?: number;
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
      const cacheKey = `tokens-${address}-${caipNetworkId}`;
      const cachedData = localStorage.getItem(cacheKey);
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

        if (caipNetworkId.startsWith("eip155")) {
          const chainId = caipNetworkId.split(":")[1];
          const response =
            await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
              address: address,
              chain: chainId,
              excludeSpam: true,
              limit: 10,
              excludeUnverifiedContracts: true,
              maxTokenInactivity: 30,
            });
          const tokenAddresses = response.result.map(token => token.tokenAddress?.toJSON()); // need to apply .toJSON() because the tokenAddress is a EVMAddress object
          const securityStatuses = await updateOrGetTokenSecurityStatus(tokenAddresses as string[], chainId);

          formattedTokens = response.result.filter(token => Number(token.usdValue) > 0.01).map(
            (token): Token => ({
              symbol: token.symbol || "Unknown",
              name: token.name || "Unknown Token",
              balance: token.balance?.toString(),
              balanceFormatted: token.balanceFormatted,
              usdPrice: Number(token.usdPrice),
              usdValue: Number(token.usdValue),
              price24hrPercentChange: Number(token.usdPrice24hrPercentChange),
              status: securityStatuses?.[token.tokenAddress?.toJSON() as string]?.status || 'unknown',
              audit_report: securityStatuses?.[token.tokenAddress?.toJSON() as string]?.audit_report || 'unknown',
            })
          ).sort((a, b) => Number(b.usdValue) - Number(a.usdValue));
        } else if (caipNetworkId.startsWith("solana")) {
          const response = await Moralis.SolApi.account.getSPL({
            address: address,
            network: "mainnet",
          });
          
          // Fetch SOL price in USD
          const solPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
          const solPriceData = await solPriceResponse.json();
          const solUsdPrice = solPriceData.solana.usd;
          
          formattedTokens = response.result
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

        // Store tokens with timestamp
        const cacheData = {
          tokens: formattedTokens,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(
          cacheKey,
          JSON.stringify(cacheData)
        );

        setTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setError(error as Error);
        setTokens([]);
        localStorage.removeItem(cacheKey);
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
