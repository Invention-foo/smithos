import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Vulnerability } from '@/types/audit';

interface CodeAuditProps {
  data: Vulnerability[];
}

export function CodeAudit({ data }: CodeAuditProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Code Audit Results</h3>
      <ul className="space-y-3">
        {data.map((issue, index) => (
          <AuditItem key={index} issue={issue} />
        ))}
      </ul>
    </div>
  );
}

function AuditItem({ issue }: { issue: Vulnerability }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="bg-green-900/50 rounded-lg p-3">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between"
      >
        <div className="flex items-start flex-grow">
          <span className={`mr-2 mt-1 ${
            issue.severity === 'Critical' ? 'text-red-400' :
            issue.severity === 'High' ? 'text-orange-400' :
            issue.severity === 'Medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            <AlertTriangle size={16} />
          </span>
          <div className="text-left">
            <span className="text-green-100">
              {issue.severity}: {issue.type}
            </span>
          </div>
        </div>
        <span className="text-green-300 ml-2">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 pl-6">
          <div className="text-sm text-green-100">
            {issue.description}
          </div>
          
          <div className="text-sm text-green-400">
            Location: {issue.location}
          </div>
          
          {issue.codeSnippet && (
            <div className="mt-2">
              <div className="text-sm text-green-300 mb-1">Code Snippet:</div>
              <pre className="bg-black/50 p-3 rounded-md overflow-x-auto">
                <code className="text-sm font-mono text-green-100 whitespace-pre">
                  {issue.codeSnippet}
                </code>
              </pre>
            </div>
          )}
          
          {issue.remediation && (
            <div className="text-sm">
              <span className="text-green-300">Remediation: </span>
              <span className="text-green-100">{issue.remediation}</span>
            </div>
          )}
        </div>
      )}
    </li>
  );
} 