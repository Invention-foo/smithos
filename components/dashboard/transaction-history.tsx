import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTransactions } from "@/hooks/use-transactions";
import { getBlockExplorerUrl } from "@/lib/wallet";
import { useAppKitNetwork } from "@reown/appkit/react";


export function TransactionHistory() {
  const { transactions, isLoading, error } = useTransactions();
  const { caipNetworkId } = useAppKitNetwork();

  if (isLoading) return <div className="animate-pulse text-green-300">Loading transactions...</div>;
  if (error) return null;

  return (
    <Card className="bg-green-950/50 backdrop-blur-sm border-green-400/20 w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-green-300 text-sm">
          {transactions.length} Transaction{transactions.length === 1 ? '' : 's'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.hash} 
              className="p-4 rounded-lg bg-green-900/40 hover:bg-green-900/60 transition-colors backdrop-blur-sm border border-green-400/10"
            >
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-green-100 font-medium">{tx.type}</p>
                  <p className="text-sm text-green-400/80">
                    {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-100">${tx.value}</p>
                  <a 
                    href={getBlockExplorerUrl(tx.hash, caipNetworkId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    View on Block Explorer →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 