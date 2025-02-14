import React, { useEffect } from 'react';
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
  useEffect(() => {
    const updateActiveTab = () => {
      // Set all tabs to darker style first
      const allTabs = document.querySelectorAll('[role="tab"]');
      allTabs.forEach(tab => {
        tab.setAttribute('style', 'background-color: color-mix(in srgb, var(--theme-color) 30%, black) !important');
      });

      // Then make active tab brighter
      const activeTab = document.querySelector('[data-state="active"]');
      if (activeTab) {
        activeTab.setAttribute('style', 'background-color: color-mix(in srgb, var(--theme-color) 70%, black) !important');
      }
    };

    // Initial update
    updateActiveTab();

    // Create observer to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          updateActiveTab();
        }
      });
    });

    // Start observing the tabs container
    const tabsList = document.querySelector('[role="tablist"]');
    if (tabsList) {
      observer.observe(tabsList, { attributes: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

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
          <TabsTrigger 
            value="assets" 
            className="bg-green-900/70 text-green-300/80 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300"
          >
            Digital Assets
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="bg-green-900/70 text-green-300/80 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-300"
          >
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
