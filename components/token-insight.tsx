import React, { useState } from 'react';
import { X, Search, BarChart2, Globe, Activity, Shield } from 'lucide-react';

interface TokenInsightProps {
  onClose: () => void;
}

export function TokenInsight({ onClose }: TokenInsightProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission logic
    console.log('Analyzing:', contractAddress, 'on', blockchain);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-[90vw] max-w-4xl h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-green-500">TokenInsight</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter contract address"
              className="flex-grow bg-green-800 text-green-100 p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              placeholder="Enter blockchain"
              className="w-1/3 bg-green-800 text-green-100 p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-700 text-green-100 px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Analyze
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-6">
          <FeatureCard
            icon={<BarChart2 className="w-6 h-6 text-green-500" />}
            title="Chart Analysis"
            description="Visualize token performance and trends with interactive charts."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-green-500" />}
            title="Project Research"
            description="Agent Smith gathers and analyzes information about the token project, including website, whitepaper, and team details."
          />
          <FeatureCard
            icon={<Activity className="w-6 h-6 text-green-500" />}
            title="On-Chain Activity Analysis"
            description="Detect suspicious activities such as insider trading or team selling through on-chain data analysis."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-green-500" />}
            title="Smart Contract Audit"
            description="Analyze token contract code to identify potential vulnerabilities and security risks."
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg border border-green-500">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg text-green-300 ml-2">{title}</h3>
      </div>
      <p className="text-green-100 text-sm">{description}</p>
    </div>
  );
}

