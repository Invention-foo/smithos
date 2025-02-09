import { useState, useEffect } from "react";
import Moralis from "moralis";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { useLocalStorageCache } from "./use-local-storage-cache";

export interface Transaction {
  date: string;
  value: string;
  type: string;
  hash: string;
}

export function useTransactions() {
  const { address } = useAppKitAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { caipNetworkId } = useAppKitNetwork();
  const { getFromCache, setToCache, removeFromCache } = useLocalStorageCache<Transaction[]>();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !caipNetworkId) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      const cacheKey = `transactions-${address}-${caipNetworkId}`;
      const cachedTransactions = getFromCache(cacheKey);
      
      if (cachedTransactions) {
        setTransactions(cachedTransactions);
        setIsLoading(false);
        return;
      }

      try {
        if (caipNetworkId.startsWith("eip155")) {
          const chainId = caipNetworkId.split(":")[1];
          const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            address: address,
            chain: chainId,
            limit: 100
          });
          const formattedTransactions = response.result.map(tx => ({
              date: new Date(tx.blockTimestamp).toISOString().split('T')[0],
              value: tx.value,
              type: tx.from.lowercase === address.toLowerCase() ? 'Sent' : 'Received',
              hash: tx.hash
            }));
            
            // Group transactions by date for daily aggregation
            const txsByDate = formattedTransactions.reduce((acc, tx) => {
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
            
            const sortedTransactions = Object.entries(txsByDate)
              .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
              .flatMap(([date, data]) => 
                data.transactions.map((tx: any) => ({
                  date,
                  value: tx.value,
                  type: tx.type,
                  hash: tx.hash
                }))
              );

          setToCache(cacheKey, sortedTransactions);
          setTransactions(sortedTransactions);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setTransactions([]);
        removeFromCache(cacheKey);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, caipNetworkId]);

  const clearTransactions = () => {
    setTransactions([]);
    if (address) {
      removeFromCache(`transactions-${address}-${caipNetworkId}`);
    }
  };

  return { transactions, isLoading, error, clearTransactions };
}
