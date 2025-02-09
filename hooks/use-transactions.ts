import { useState, useEffect } from "react";
import Moralis from "moralis";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";

export interface Transaction {
  date: string;
  value: number;
}

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

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

      const cacheKey = `transactions-${address}-${caipNetworkId}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { transactions: cachedTransactions, timestamp } = JSON.parse(cachedData);
        const now = new Date().getTime();

        if (now - timestamp < ONE_HOUR) {
          setTransactions(cachedTransactions);
          setIsLoading(false);
          return;
        }
      }

      try {
        if (caipNetworkId.startsWith("eip155")) {
          const chainId = caipNetworkId.split(":")[1];
          const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            address: address,
            chain: chainId,
            limit: 100
          });
          // Group transactions by date for daily aggregation
          const txsByDate = response.result.reduce((acc, tx) => {
            const date = tx.blockTimestamp.toISOString().split('T')[0];
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
          }, {} as Record<string, any>);

          const formattedTransactions = Object.entries(txsByDate)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, data]) => ({
              date,
              value: data.volume.toString()
            }));

          // Store transactions with timestamp
          const cacheData = {
            transactions: formattedTransactions,
            timestamp: new Date().getTime(),
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));

          setTransactions(formattedTransactions);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setTransactions([]);
        localStorage.removeItem(cacheKey);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, caipNetworkId]);

  const clearTransactions = () => {
    setTransactions([]);
    if (address) {
      localStorage.removeItem(`transactions-${address}-${caipNetworkId}`);
    }
  };

  return { transactions, isLoading, error, clearTransactions };
}
