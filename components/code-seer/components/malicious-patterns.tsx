import { AlertTriangle, Search } from 'lucide-react';

interface MaliciousPatternsProps {
  data: Array<{ detected: boolean; name: string }>;
}

export function MaliciousPatterns({ data }: MaliciousPatternsProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Malicious Pattern Detection</h3>
      <ul className="space-y-2">
        {data.map((pattern, index) => (
          <li key={index} className="flex items-center">
            {pattern.detected ? (
              <AlertTriangle size={16} className="mr-2 text-red-400" />
            ) : (
              <Search size={16} className="mr-2 text-green-400" />
            )}
            <span className="text-green-100">{pattern.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 