import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { TruncatedAddress } from './truncated-address'
import { useWallet } from '@/hooks/use-wallet';
import { useTokenHoldings, Token } from '@/hooks/use-token-holdings';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

interface TokenHoldingsProps {
  onClose: () => void;
}

export function TokenHoldings({ onClose }: TokenHoldingsProps) {
  const { disconnectWallet } = useWallet();
  const { address } = useAppKitAccount();
  const { tokens, isLoading, error } = useTokenHoldings();
  const { caipNetworkId } = useAppKitNetwork();
  const [showHidden, setShowHidden] = useState(false);

  const isEthereum = caipNetworkId?.startsWith('eip155');
  const isSolana = caipNetworkId?.startsWith('solana');

  const visibleTokens = tokens.filter(token => !token.hide);
  const hiddenTokens = tokens.filter(token => token.hide);

  const TokenCard = ({ token }: { token: Token }) => (
    <div 
      className={`p-4 rounded-lg bg-green-800/60 
        flex justify-between items-center hover:bg-opacity-80 transition-colors duration-200 hover:shadow-lg`}
    >
      <div className="flex items-center">
        <div>
          <p className="font-bold text-green-100">{token.symbol}</p>
          <p className="text-sm text-green-300/90">{token.name}</p>
          {isEthereum && token.usdPrice && (
            <p className="text-xs text-green-400/90 mt-0.5">
              ${token.usdPrice.toFixed(2)} 
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {isEthereum && token.usdValue && (
          <p className="text-sm text-green-300/90">${token.usdValue.toFixed(2)}</p>
        )}
        {isSolana ? (
          <p className="text-lg font-medium">{Number(token.balanceFormatted)} SOL</p>
        ) : (
          <p className="text-lg font-medium">{Number(token.balanceFormatted).toFixed(2)}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-green-900/90 border border-green-500 p-8 rounded-xl w-[32rem] max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-400">Asset Nexus</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={disconnectWallet} 
              className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
            >
              Disconnect
            </button>
            <button 
              onClick={onClose} 
              className="text-green-500 hover:text-green-400 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="mb-6 flex items-center justify-between bg-green-800/50 p-3 rounded-lg">
          <span className="text-green-300 text-sm font-medium">Decentralized ID:</span>
          <TruncatedAddress address={address || ""} />
        </div>
        <div 
          className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-green-900 scrollbar-thumb-green-700 hover:scrollbar-thumb-green-600"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#047857 #064e3b'
          }}
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-green-300">Loading tokens...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8">
              <p className="text-red-400">Error loading tokens</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-green-300 mb-2">No tokens found in this wallet</p>
              <p className="text-green-400/70 text-sm">
                {isEthereum ? "Try adding some ERC20 tokens" : isSolana ? "Try adding some SPL tokens" : "Connect a wallet to view tokens"}
              </p>
            </div>
          ) : (
            <>
              {visibleTokens.map((token, index) => (
                <TokenCard key={index} token={token} />
              ))}
              
              {hiddenTokens.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowHidden(!showHidden)}
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors duration-200 w-full justify-between p-2 rounded-lg bg-green-800/30"
                  >
                    <span>{showHidden ? 'Hide' : 'Show'} Small Balance Tokens ({hiddenTokens.length})</span>
                    {showHidden ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {showHidden && (
                    <div className="mt-3 space-y-3">
                      {hiddenTokens.map((token, index) => (
                        <TokenCard key={index} token={token} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
