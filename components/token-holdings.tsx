import React from 'react';
import { X } from 'lucide-react';
import { TruncatedAddress } from './truncated-address'
import { useWallet } from '@/hooks/use-wallet';

interface Token {
  symbol: string;
  name: string;
  balance: string;
  status: 'green' | 'yellow' | 'red';
}

interface TokenHoldingsProps {
  onClose: () => void;
}

const tokens: Token[] = [
  { symbol: 'SMITH', name: 'Agent Smith', balance: '1000.00', status: 'green' },
  { symbol: 'ETH', name: 'Ethereum', balance: '5.5', status: 'green' },
  { symbol: 'USDC', name: 'USD Coin', balance: '2500.00', status: 'yellow' },
  { symbol: 'LINK', name: 'Chainlink', balance: '100.00', status: 'red' },
];

export function TokenHoldings({ onClose }: TokenHoldingsProps) {
  const { address: walletAddress = '', disconnectWallet } = useWallet()
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-green-500">Asset Nexus</h2>
          <div>
            <button onClick={disconnectWallet} className="text-red-500 hover:text-red-400 mr-4">
              Disconnect
            </button>
            <button onClick={onClose} className="text-green-500 hover:text-green-400">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-green-300 text-sm">Decentralized ID:</span>
          <TruncatedAddress address={walletAddress} />
        </div>
        <div className="space-y-2">
          {tokens.map((token) => (
            <div 
              key={token.symbol} 
              className={`p-2 rounded ${token.symbol === 'SMITH' ? 'bg-green-700' : 'bg-green-800'} flex justify-between items-center`}
            >
              <div className="flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    token.status === 'green' ? 'bg-green-400' : 
                    token.status === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
                <div>
                  <p className="font-bold">{token.symbol}</p>
                  <p className="text-sm text-green-300">{token.name}</p>
                </div>
              </div>
              <p className="text-lg">{token.balance}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

