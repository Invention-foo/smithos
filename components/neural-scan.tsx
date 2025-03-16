import React, { useState } from 'react';
import { X, BarChart2, Globe, Activity, Shield, AlertTriangle } from 'lucide-react';
import { ModalWrapper } from '@/components/modal-wrapper';

interface NeuralScanProps {
  onClose: () => void;
}

export function NeuralScan({ onClose }: NeuralScanProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission logic
    console.log('Analyzing:', contractAddress, 'on', blockchain);
  };

  return (
    <ModalWrapper onClose={onClose} className="p-6 rounded-lg w-[90vw] max-w-4xl h-[80vh] overflow-y-auto">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl text-green-300 mb-2">Coming Soon</h3>
          <p className="text-green-400/80">
            NeuralScan is currently in development and will be available in a future update. 
            Check the roadmap for more details.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-green-700 text-green-100 rounded hover:bg-green-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Original content (blurred behind overlay) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-green-500">NeuralScan</h2>
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
          title="Neural Mapping"
          description="Visualize token performance and network connections with interactive neural charts."
        />
        <FeatureCard
          icon={<Globe className="w-6 h-6 text-green-500" />}
          title="Digital Footprint Analysis"
          description="Agent Smith traces the project's digital presence, uncovering hidden connections and validating claims."
        />
        <FeatureCard
          icon={<Activity className="w-6 h-6 text-green-500" />}
          title="Anomaly Detection"
          description="Identify suspicious on-chain activities and behavioral patterns that deviate from the norm."
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6 text-green-500" />}
          title="Code Matrix Audit"
          description="Analyze the token's underlying code matrix to identify potential glitches and security breaches."
        />
      </div>
    </ModalWrapper>
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

