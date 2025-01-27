import { AlertTriangle } from 'lucide-react';

interface CodeAuditProps {
  data: Array<{
    type: string
    severity: string
    description: string
    location: string
    codeSnippet: string
    remediation: string
  }>;
}

export function CodeAudit({ data }: CodeAuditProps) {
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
              issue.severity === 'Low' ? 'text-green-400' :
              'text-green-400'
            }`}>
              <AlertTriangle size={16} />
            </span>
            <div>
              <span className="text-green-100">
                {issue.severity}: {issue.description}
              </span>
              <div className="mt-1 text-sm text-green-400">
                Location: {issue.location}
              </div>
              {issue.remediation && (
                <div className="mt-1 text-sm text-green-300">
                  Remediation: {issue.remediation}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 