export interface LiveAuditData {
  name: string | null;
  symbol: string | null;
  totalSupply: string | null;
  buyTax: number;
  sellTax: number;
  ownershipRenounced: boolean;
  lpLocked: boolean;
  lastUpdated: string;
}

export interface Vulnerability {
  type: string;
  severity: string;
  description: string;
  location: string;
  codeSnippet: string;
  remediation: string;
}

export interface MaliciousPattern {
  type: string;
  description: string;
  location: string;
  impact: string;
  resolution: string;
}

export interface TokenomicsData {
  supply: {
    total: number | null;
    description: string;
  };
  taxes: {
    buy: {
      startingPercentage: number | null;
      finalPercentage: number | null;
      purpose: string;
      description: string;
    };
    sell: {
      startingPercentage: number | null;
      finalPercentage: number | null;
      purpose: string;
      description: string;
    };
    transfer: {
      startingPercentage: number | null;
      finalPercentage: number | null;
      purpose: string;
      description: string;
    };
  };
  burning: {
    amountPercent: number | null;
    description: string;
  };
  minting: {
    description: string;
  };
  antiWhale: {
    description: string;
  };
  walletLimits: {
    maxTransactionAmountPercent: number | null;
    maxWalletPercent: number | null;
    description: string;
  };
}

export interface RiskAssessmentData {
  summary: string;
  commonality: {
    description: string;
    riskImplications: string;
  };
  maliciousPotential: {
    description: string;
    investorImpact: string;
  };
  overallRisk: string;
  conclusion: string;
}

export interface AuditResults {
  riskAssessment: RiskAssessmentData;
  codeAudit: Vulnerability[];
  maliciousPatterns: MaliciousPattern[];
  tokenomics: TokenomicsData;
  liveAudit: LiveAuditData;
  isScam: boolean;
}

export interface StoredAuditResult {
  contract_address: string;
  blockchain: string;
  audit_result: {
    riskAssessment: RiskAssessmentData;
    codeAudit: Vulnerability[];
    maliciousPatterns: MaliciousPattern[];
    tokenomics: TokenomicsData;
    isScam: boolean;
  };
  created_at: string;
} 