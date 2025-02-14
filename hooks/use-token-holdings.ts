import { useState, useEffect } from "react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { walletService } from "@/services/wallet.service";
import type { Token } from "@/types/wallet";

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

      // const storedTokens = walletService.getStoredTokens(address, caipNetworkId);
      // if (storedTokens) {
      //   setTokens(storedTokens);
      //   setIsLoading(false);
      //   return;
      // }

      setIsLoading(true);
      try {
        const fetchedTokens = await walletService.fetchAndCacheTokens(address, caipNetworkId);
        setTokens(fetchedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setError(error as Error);
        setTokens([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [address, caipNetworkId]);

  const clearTokenHoldings = () => {
    setTokens([]);
    if (address && caipNetworkId) {
      walletService.clearStoredTokens(address, caipNetworkId);
    }
  };

  return { tokens, isLoading, error, clearTokenHoldings };
}
