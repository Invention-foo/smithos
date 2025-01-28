import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { MaliciousPattern } from '@/types/audit';

interface MaliciousPatternsProps {
  data: MaliciousPattern[];
}

export function MaliciousPatterns({ data }: MaliciousPatternsProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Malicious Patterns</h3>
      {data.length === 0 ? (
        <p className="text-green-100">No malicious patterns detected.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((pattern, index) => (
            <PatternItem key={index} pattern={pattern} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PatternItem({ pattern }: { pattern: MaliciousPattern }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="bg-green-900/50 rounded-lg p-3">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between"
      >
        <div className="flex items-start flex-grow">
          <span className="mr-2 mt-1 text-red-400">
            <AlertTriangle size={16} />
          </span>
          <div className="text-left">
            <span className="text-green-100">
              {pattern.type}
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
            {pattern.description}
          </div>
          
          <div className="text-sm text-green-400">
            Location: {pattern.location}
          </div>
          
          <div className="text-sm">
            <span className="text-green-300">Impact: </span>
            <span className="text-green-100">{pattern.impact}</span>
          </div>
          
          {pattern.resolution && (
            <div className="text-sm">
              <span className="text-green-300">Resolution: </span>
              <span className="text-green-100">{pattern.resolution}</span>
            </div>
          )}
        </div>
      )}
    </li>
  );
} 