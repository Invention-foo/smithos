import { useState, useEffect } from "react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { walletService } from "@/services/wallet.service";
import type { Pnl } from "@/types/wallet";

export function usePnl() {
  const { address } = useAppKitAccount();
  const [pnl, setPnl] = useState<Pnl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { caipNetworkId } = useAppKitNetwork();

  useEffect(() => {
    const fetchPnl = async () => {
      if (!address || !caipNetworkId) {
        setPnl(null);
        setIsLoading(false);
        return;
      }

      const cachedPnl = walletService.getStoredPnl(address, caipNetworkId);
      if (cachedPnl) {
        setPnl(cachedPnl);
        setIsLoading(false);
        return;
      }

      try {
        const fetchedPnl = await walletService.fetchAndCachePnl(address, caipNetworkId);
        setPnl(fetchedPnl);
      } catch (error) {
        console.error("Error fetching PnL:", error);
        setError(error as Error);
        setPnl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPnl();
  }, [address, caipNetworkId]);

  const clearPnl = () => {
    setPnl(null);
    if (address && caipNetworkId) {
      walletService.clearStoredPnl(address, caipNetworkId);
    }
  };

  return { pnl, isLoading, error, clearPnl };
}

