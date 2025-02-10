import React from 'react';
import { X } from 'lucide-react';
import { ModalWrapper } from '@/components/modal-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from './transaction-history'; 
import { DigitalAssets } from './digital-assets';
import { PortfolioActivity } from './portfolio-activity';
import { PortfolioValue } from './portfolio-value';


interface DashboardProps {
  onClose: () => void;
}

export function Dashboard({ onClose }: DashboardProps) {
  return (
    <ModalWrapper onClose={onClose} className="bg-gradient-to-b from-green-950 to-green-900 border border-green-400/30 shadow-xl p-8 rounded-xl w-[85vw] h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <div>
          <PortfolioValue />
        </div>
        <button onClick={onClose} className="text-green-400/80 hover:text-green-300 transition-colors">
          <X size={24} />
        </button>
      </div>

      <PortfolioActivity />
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
          <DigitalAssets />
        </TabsContent>
        <TabsContent value="history">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </ModalWrapper>
  );
}
