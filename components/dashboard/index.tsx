import React from 'react';
import { X } from 'lucide-react';
import { useTokenHoldings } from "@/hooks/use-token-holdings";
import { useTransactions } from "@/hooks/use-transactions";
import { ModalWrapper } from '@/components/modal-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from './transaction-history'; 
import { DigitalAssets } from './digital-assets';
import { PortfolioActivity } from './portfolio-activity';

interface DashboardProps {
  onClose: () => void;
}

export function Dashboard({ onClose }: DashboardProps) {
  const { tokens, isLoading: tokensLoading, error: tokensError } = useTokenHoldings();
  const { transactions, isLoading: txLoading, error: txError } = useTransactions();
  const totalValue = tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);
  
  const chartData = transactions.map((tx) => ({
    date: new Date(tx.date).toLocaleDateString(),
    value: tx.value,
  }));

  return (
    <ModalWrapper onClose={onClose} className="bg-gradient-to-b from-green-950 to-green-900 border border-green-400/30 shadow-xl p-8 rounded-xl w-[85vw] h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-green-300 mt-2">Portfolio Value: ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</p>
        </div>
        <button onClick={onClose} className="text-green-400/80 hover:text-green-300 transition-colors">
          <X size={24} />
        </button>
      </div>

      {tokensLoading || txLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-green-300">Loading portfolio data...</div>
        </div>
      ) : tokensError || txError ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/20">
            Error loading portfolio data
          </div>
        </div>
      ) : (
        <>
          <PortfolioActivity chartData={chartData} />
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-green-950/50 border border-green-400/20">
              <TabsTrigger value="assets" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-300">
                Digital Assets
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-green-900/50 data-[state=active]:text-green-300">
                Transaction History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="assets">
              <DigitalAssets tokens={tokens} />
            </TabsContent>
            <TabsContent value="history">
              <TransactionHistory transactions={transactions} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </ModalWrapper>
  );
}
