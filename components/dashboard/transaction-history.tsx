import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Transaction } from '@/types/wallet';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const formatEth = (value: string) => {
  const eth = Number.parseFloat(value) / 1e18
  return eth.toFixed(4)
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
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
                    {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-100">{formatEth(tx.value)} ETH</p>
                  <a 
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    View on Etherscan →
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