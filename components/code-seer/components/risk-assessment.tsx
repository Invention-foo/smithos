import { AlertTriangle } from 'lucide-react';

interface RiskAssessmentProps {
  data: {
    summary: string;
    commonality: {
      description: string;
      riskImplications: string;
    };
    maliciousPotential: {
      description: string;
      investorImpact: string;
    };
  };
  codeAudit: Array<{
    severity: string;
    description: string;
  }>;
  maliciousPatterns: Array<{
    detected: boolean;
    name: string;
  }>;
}

export function RiskAssessment({ data, codeAudit, maliciousPatterns }: RiskAssessmentProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-4">Risk Assessment Summary</h3>
      
      <div className="space-y-4">
        <div className="p-3 border border-green-700 rounded-lg">
          <p className="text-green-100">{data.summary}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-2 bg-green-900/50 rounded">
            <p className="text-red-400 font-semibold">Critical</p>
            <p className="text-2xl text-red-400">
              {codeAudit.filter(issue => issue.severity.toLowerCase() === 'critical').length}
            </p>
          </div>
          <div className="p-2 bg-green-900/50 rounded">
            <p className="text-orange-400 font-semibold">High</p>
            <p className="text-2xl text-orange-400">
              {codeAudit.filter(issue => issue.severity.toLowerCase() === 'high').length}
            </p>
          </div>
          <div className="p-2 bg-green-900/50 rounded">
            <p className="text-yellow-400 font-semibold">Medium</p>
            <p className="text-2xl text-yellow-400">
              {codeAudit.filter(issue => issue.severity.toLowerCase() === 'medium').length}
            </p>
          </div>
          <div className="p-2 bg-green-900/50 rounded">
            <p className="text-green-400 font-semibold">Low</p>
            <p className="text-2xl text-green-400">
              {codeAudit.filter(issue => issue.severity.toLowerCase() === 'low').length}
            </p>
          </div>
          <div className="p-2 bg-green-900/50 rounded">
            <p className="text-red-400 font-semibold">Malicious</p>
            <p className="text-2xl text-red-400">
              {maliciousPatterns.filter(pattern => pattern.detected).length}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-green-300">
            <p className="font-semibold">Risk Profile:</p>
            <p>{data.commonality.description}</p>
            <p className="mt-1">{data.maliciousPotential.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 