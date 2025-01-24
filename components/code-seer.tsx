import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Code, BarChart } from 'lucide-react';

interface CodeSeerProps {
  onClose: () => void;
}

export function CodeSeer({ onClose }: CodeSeerProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('');
  const [auditResults, setAuditResults] = useState<AuditResults | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual audit logic
    const mockAudit: AuditResults = {
      riskAssessment: {
        overallRisk: 'Medium',
        securityScore: 75,
        criticalIssues: 1,
        highIssues: 2,
        mediumIssues: 3,
        lowIssues: 5,
      },
      codeAudit: [
        { severity: 'Critical', description: 'Unprotected selfdestruct function' },
        { severity: 'High', description: 'Reentrancy vulnerability in withdraw function' },
        { severity: 'Medium', description: 'Unchecked return value from external call' },
      ],
      maliciousPatterns: [
        { detected: false, name: 'Honeypot' },
        { detected: true, name: 'Hidden Mint Function' },
        { detected: false, name: 'Backdoor' },
      ],
      tokenomics: {
        totalSupply: '1,000,000,000',
        circulatingSupply: '750,000,000',
        ownerHoldings: '20%',
        topHolders: [
          { address: '0x1234...5678', percentage: '15%' },
          { address: '0x9876...5432', percentage: '10%' },
          { address: '0xabcd...efgh', percentage: '5%' },
        ],
      },
    };
    setAuditResults(mockAudit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-900 border border-green-500 p-6 rounded-lg w-[90vw] max-w-4xl h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-green-500">CodeSeer</h2>
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
            <select
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              className="w-1/3 bg-green-800 text-green-100 p-2 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select blockchain</option>
              <option value="ethereum">Ethereum</option>
              <option value="binance">Binance Smart Chain</option>
              <option value="polygon">Polygon</option>
            </select>
            <button
              type="submit"
              className="bg-green-700 text-green-100 px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Analyze
            </button>
          </div>
        </form>

        {auditResults && (
          <div className="space-y-6">
            <RiskAssessment data={auditResults.riskAssessment} />
            <CodeAudit data={auditResults.codeAudit} />
            <MaliciousPatterns data={auditResults.maliciousPatterns} />
            <Tokenomics data={auditResults.tokenomics} />
          </div>
        )}
      </div>
    </div>
  );
}

interface RiskAssessmentProps {
  data: {
    overallRisk: string;
    securityScore: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
}

function RiskAssessment({ data }: RiskAssessmentProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Risk Assessment Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-green-100">Overall Risk: <span className="font-bold">{data.overallRisk}</span></p>
          <p className="text-green-100">Security Score: <span className="font-bold">{data.securityScore}/100</span></p>
        </div>
        <div>
          <p className="text-red-400">Critical Issues: {data.criticalIssues}</p>
          <p className="text-orange-400">High Issues: {data.highIssues}</p>
          <p className="text-yellow-400">Medium Issues: {data.mediumIssues}</p>
          <p className="text-green-400">Low Issues: {data.lowIssues}</p>
        </div>
      </div>
    </div>
  );
}

interface CodeAuditProps {
  data: Array<{ severity: string; description: string }>;
}

function CodeAudit({ data }: CodeAuditProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Code Audit Results</h3>
      <ul className="space-y-2">
        {data.map((issue, index) => (
          <li key={index} className="flex items-start">
            <span className={`mr-2 ${
              issue.severity === 'Critical' ? 'text-red-400' :
              issue.severity === 'High' ? 'text-orange-400' :
              issue.severity === 'Medium' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              <AlertTriangle size={16} />
            </span>
            <span className="text-green-100">{issue.severity}: {issue.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface MaliciousPatternsProps {
  data: Array<{ detected: boolean; name: string }>;
}

function MaliciousPatterns({ data }: MaliciousPatternsProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Malicious Pattern Detection</h3>
      <ul className="space-y-2">
        {data.map((pattern, index) => (
          <li key={index} className="flex items-center">
            {pattern.detected ? (
              <AlertTriangle size={16} className="mr-2 text-red-400" />
            ) : (
              <CheckCircle size={16} className="mr-2 text-green-400" />
            )}
            <span className="text-green-100">{pattern.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TokenomicsProps {
  data: {
    totalSupply: string;
    circulatingSupply: string;
    ownerHoldings: string;
    topHolders: Array<{ address: string; percentage: string }>;
  };
}

function Tokenomics({ data }: TokenomicsProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Tokenomics Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-green-100">Total Supply: {data.totalSupply}</p>
          <p className="text-green-100">Circulating Supply: {data.circulatingSupply}</p>
          <p className="text-green-100">Owner Holdings: {data.ownerHoldings}</p>
        </div>
        <div>
          <p className="text-green-100 font-semibold">Top Holders:</p>
          <ul className="text-green-100">
            {data.topHolders.map((holder, index) => (
              <li key={index}>{holder.address}: {holder.percentage}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

interface AuditResults {
  riskAssessment: {
    overallRisk: string;
    securityScore: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  codeAudit: Array<{ severity: string; description: string }>;
  maliciousPatterns: Array<{ detected: boolean; name: string }>;
  tokenomics: {
    totalSupply: string;
    circulatingSupply: string;
    ownerHoldings: string;
    topHolders: Array<{ address: string; percentage: string }>;
  };
}

