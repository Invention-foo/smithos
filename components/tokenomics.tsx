import React, { useState, useRef } from 'react';
import { X, PieChart, Copy, Check } from 'lucide-react';
import { ModalWrapper } from '@/components/modal-wrapper';
import { ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { hexToRgb } from '@/hooks/useThemeColor';

interface TokenomicsProps {
  onClose: () => void;
}

// Updated tokenomics data with actual allocations
const tokenomicsData = [
  { name: 'Open Float (DEX Pool)', value: 12.5, tokens: 125000000 },
  { name: 'Athena Airdrop', value: 33.46, tokens: 334575648 },
  { name: 'Reserved for Late Claimers', value: 27.93, tokens: 279255257 },
  { name: 'Team & Development', value: 13.11, tokens: 131084547 },
  { name: 'Operations & Marketing', value: 13, tokens: 130084548 },
];

const totalSupply = 1000000000; // 1 billion tokens

export function Tokenomics({ onClose }: TokenomicsProps) {
  const [activeTab, setActiveTab] = useState('distribution');
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x991ab5d07F28232EC1677e2c13239fB9b4B9CcB7";
  const { display } = useSettingsStore();
  
  // Generate colors based on theme color
  const generateThemeColors = () => {
    const baseColor = display.themeColor;
    const { r, g, b } = hexToRgb(baseColor);
    
    return [
      baseColor, // Main theme color
      `rgba(${r}, ${g}, ${b}, 0.85)`, // 85% opacity
      `rgba(${r}, ${g}, ${b}, 0.7)`,  // 70% opacity
      `rgba(${r}, ${g}, ${b}, 0.55)`, // 55% opacity
      `rgba(${r}, ${g}, ${b}, 0.4)`,  // 40% opacity
    ];
  };
  
  const themeColors = generateThemeColors();
  
  // Generate tooltip background color based on theme
  const tooltipBgColor = () => {
    const { r, g, b } = hexToRgb(display.themeColor);
    return `rgba(${r}, ${g}, ${b}, 0.15)`; // Very light version of theme color
  };
  
  // Generate tooltip text color based on theme
  const tooltipTextColor = () => {
    const { r, g, b } = hexToRgb(display.themeColor);
    return `rgba(${r}, ${g}, ${b}, 0.9)`; // Slightly transparent version of theme color
  };

  const tabs = [
    { id: 'distribution', label: 'Token Distribution' },
    { id: 'utility', label: 'Utility & Benefits' },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

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
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Contract:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-100 text-sm">{truncateAddress(contractAddress)}</span>
                      <button 
                        onClick={copyToClipboard} 
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Copy contract address"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-300 mb-3">Token Allocation</h3>
                <div className="space-y-2">
                  {tokenomicsData.map((item, index) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: themeColors[index % themeColors.length] }}
                        ></div>
                        <span className="text-green-300 mr-2">{item.name}:</span>
                      </div>
                      <span className="text-green-100 text-right">{item.value}% ({item.tokens.toLocaleString()})</span>
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
                  <RechartPieChart margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
                    <Pie
                      data={tokenomicsData}
                      cx="45%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={false}
                    >
                      {tokenomicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name, props) => {
                        const item = tokenomicsData.find(item => item.name === name);
                        return [`${name}: ${value}% (${item?.tokens.toLocaleString()} tokens)`, ''];
                      }}
                      contentStyle={{ 
                        backgroundColor: tooltipBgColor(), 
                        borderColor: display.themeColor, 
                        color: tooltipTextColor(),
                        padding: '8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      formatter={(value, entry, index) => (
                        <span className="text-xs">{value}</span>
                      )}
                      iconType="circle"
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: '20px' }}
                    />
                  </RechartPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-green-300 text-xs">
                <p>The token distribution prioritizes community ownership with over 60% allocated to Athena holders and public liquidity.</p>
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