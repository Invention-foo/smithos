import React, { useState } from 'react';
import { X, PieChart } from 'lucide-react';
import { ModalWrapper } from '@/components/modal-wrapper';
import { ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface TokenomicsProps {
  onClose: () => void;
}

// Sample tokenomics data - replace with your actual data
const tokenomicsData = [
  { name: 'Team', value: 15, color: '#10B981' },
  { name: 'Marketing', value: 10, color: '#059669' },
  { name: 'Development', value: 15, color: '#047857' },
  { name: 'Liquidity', value: 30, color: '#065F46' },
  { name: 'Community', value: 30, color: '#064E3B' },
];

const totalSupply = 1000000000; // 1 billion tokens

export function Tokenomics({ onClose }: TokenomicsProps) {
  const [activeTab, setActiveTab] = useState('distribution');

  const tabs = [
    { id: 'distribution', label: 'Token Distribution' },
    { id: 'utility', label: 'Utility & Benefits' },
  ];

  return (
    <ModalWrapper onClose={onClose} className="rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-green-500">
        <h2 className="text-2xl text-green-500">Tokenomics</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-500">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-green-300 hover:text-green-200 focus:outline-none ${
              activeTab === tab.id ? 'bg-green-800 border-b-2 border-green-500' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Token info */}
            <div className="space-y-6">
              <div className="bg-green-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-300 mb-3">Token Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-300">Token Name:</span>
                    <span className="text-green-100">Agent Smith</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Symbol:</span>
                    <span className="text-green-100">$SMITH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Total Supply:</span>
                    <span className="text-green-100">{totalSupply.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-300">Contract:</span>
                    <span className="text-green-100 text-sm">0x991ab5d07F28232EC1677e2c13239fB9b4B9CcB7</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-300 mb-3">Token Allocation</h3>
                <div className="space-y-2">
                  {tokenomicsData.map((item) => (
                    <div key={item.name} className="flex justify-between">
                      <span className="text-green-300">{item.name}:</span>
                      <span className="text-green-100">{item.value}% ({(totalSupply * item.value / 100).toLocaleString()})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Chart */}
            <div className="bg-green-800/50 p-4 rounded-lg flex flex-col">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Allocation Distribution</h3>
              <div className="flex-grow">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartPieChart>
                    <Pie
                      data={tokenomicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tokenomicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => [`${value}% (${(totalSupply * Number(value) / 100).toLocaleString()} tokens)`, 'Allocation']}
                      contentStyle={{ backgroundColor: '#064e3b', borderColor: '#10b981', color: '#ecfdf5' }}
                    />
                    <Legend />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-green-300 text-sm">
                <p>The token distribution is designed to ensure long-term sustainability and community governance of the Agent Smith ecosystem.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'utility' && (
          <div className="space-y-6">
            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Token Utility</h3>
              <p className="text-green-200 mb-4">
                The $SMITH token is designed to provide value and utility throughout the Agent Smith ecosystem.
                Holders gain access to premium features, governance rights, and economic incentives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-green-800 rounded">
                  <h4 className="font-medium text-green-200 mb-2">Premium Access</h4>
                  <p className="text-sm text-green-300">
                    Token holders gain access to advanced features in SmithOS, including enhanced security scanning, 
                    priority analysis, and exclusive tools.
                  </p>
                </div>
                <div className="p-3 bg-green-800 rounded">
                  <h4 className="font-medium text-green-200 mb-2">Governance</h4>
                  <p className="text-sm text-green-300">
                    $SMITH holders can vote on protocol upgrades, feature prioritization, and ecosystem development 
                    through the decentralized governance system.
                  </p>
                </div>
                <div className="p-3 bg-green-800 rounded">
                  <h4 className="font-medium text-green-200 mb-2">Staking Rewards</h4>
                  <p className="text-sm text-green-300">
                    Stake your tokens to earn passive income through protocol fees and incentives, 
                    with higher APY for longer lock periods.
                  </p>
                </div>
                <div className="p-3 bg-green-800 rounded">
                  <h4 className="font-medium text-green-200 mb-2">Fee Discounts</h4>
                  <p className="text-sm text-green-300">
                    Holding $SMITH tokens provides discounts on platform services, with tiered benefits 
                    based on the amount of tokens held.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Economic Model</h3>
              <p className="text-green-200 mb-4">
                The $SMITH token implements a deflationary model with the following mechanisms:
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-100 pl-4">
                <li>2% of all transactions are automatically burned, reducing total supply over time</li>
                <li>Revenue from premium services is used for token buybacks and burns</li>
                <li>Staking incentives encourage long-term holding and reduced circulating supply</li>
                <li>Governance treasury funded by protocol fees for sustainable development</li>
              </ul>
            </div>

            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Future Benefits</h3>
              <p className="text-green-200 mb-4">
                The roadmap includes additional utility for $SMITH token holders:
              </p>
              <ul className="list-disc list-inside space-y-2 text-green-100 pl-4">
                <li>NFT access passes for exclusive events and features</li>
                <li>Cross-chain integration for expanded utility</li>
                <li>Partner protocol benefits and integrations</li>
                <li>Early access to new security tools and features</li>
                <li>Revenue sharing from enterprise security services</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
} 