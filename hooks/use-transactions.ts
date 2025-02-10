import { useState, useEffect } from "react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { walletService } from "../services/wallet.service";
import type { Transaction } from "../types/wallet";

export function useTransactions() {
  const { address } = useAppKitAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { caipNetworkId } = useAppKitNetwork();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !caipNetworkId) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        const cachedTransactions = walletService.getStoredTransactions(
          address,
          caipNetworkId
        );

        if (cachedTransactions) {
          setTransactions(cachedTransactions);
          setIsLoading(false);
          return;
        }

        const newTransactions = await walletService.fetchAndCacheTransactions(
          address,
          caipNetworkId
        );
        setTransactions(newTransactions);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setTransactions([]);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, caipNetworkId]);

  const clearTransactions = () => {
    setTransactions([]);
    if (address && caipNetworkId) {
      walletService.clearStoredTransactions(address, caipNetworkId);
    }
  };

  return { transactions, isLoading, error, clearTransactions };
}
