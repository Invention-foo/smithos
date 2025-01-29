import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
      <p className="text-green-300 text-lg font-semibold">Analyzing Contract...</p>
      <div className="text-green-400/80 text-sm text-center max-w-md">
        Agent Smith is scanning the contract for vulnerabilities, malicious patterns, and tokenomics analysis.
      </div>
    </div>
  );
} 