"use client"

import { useState } from 'react';
import { X, AlertTriangle, Search } from 'lucide-react';
import { isAddress, getAddress } from 'ethers';
import { RiskAssessment } from './components/risk-assessment';
import { CodeAudit } from './components/code-audit';
import { MaliciousPatterns } from './components/malicious-patterns';
import { Tokenomics } from './components/tokenomics';
import { AuditResults } from '@/types/audit';
import { auditToken } from './actions';
import { LoadingScreen } from './components/loading-screen';

interface CodeSeerProps {
  onClose: () => void;
}

export function CodeSeer({ onClose }: CodeSeerProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('');
  const [addressError, setAddressError] = useState('');
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Address validation handler
  const handleAddressChange = (value: string) => {
    setAddressError('');
    if (!value) {
      setContractAddress('');
      return;
    }
    if (!value.startsWith('0x') || value.length !== 42) {
      setAddressError('Invalid address format');
      setContractAddress(value);
      return;
    }
    try {
      if (!isAddress(value)) {
        setAddressError('Invalid address format');
        setContractAddress(value);
        return;
      }
      const checksumAddress = getAddress(value);
      setContractAddress(checksumAddress);
    } catch (error) {
      setAddressError('Invalid address format');
      setContractAddress(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addressError || !contractAddress || !blockchain) return;

    setIsLoading(true);
    setError('');
    
    try {
      const results = await auditToken({ 
        contractAddress,
        blockchain: blockchain.toLowerCase(),
      })
      
      setAuditResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during audit');
      console.error('Audit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-[90vw] max-w-4xl h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-green-500">CodeSeer Analysis</h2>
          <button onClick={onClose} className="text-green-500 hover:text-green-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Enter contract address"
              className="flex-grow bg-green-800 text-green-100 p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <select
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              className="w-1/3 bg-green-800 text-green-100 p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select blockchain</option>
              <option value="ethereum">Ethereum</option>
            </select>
            <button
              type="submit"
              disabled={!!addressError || !contractAddress || isLoading}
              className="bg-green-700 text-green-100 px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {addressError && (
            <p className="text-red-400 text-sm mt-2">{addressError}</p>
          )}
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingScreen />
        ) : (
          auditResults && (
            <div className="space-y-6">
              {auditResults.isScam && (
                <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg mb-6">
                  <p className="text-red-400 font-bold">⚠️ Warning: This contract contains unresolvable malicious patterns!</p>
                </div>
              )}
              <RiskAssessment 
                data={auditResults.riskAssessment}
                codeAudit={auditResults.codeAudit}
                maliciousPatterns={auditResults.maliciousPatterns}
              />
              <CodeAudit data={auditResults.codeAudit} />
              <MaliciousPatterns data={auditResults.maliciousPatterns} />
              <Tokenomics data={auditResults.tokenomics} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

