export interface Transaction {
  date: string;
  value: string;
  type: string;
  hash: string;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  usdPrice?: number;
  usdValue?: number;
  status?: string;
  audit_report?: string;
  price24hrPercentChange?: number;
  codeseerAudit?: {
    maliciousPatterns?: number;
    riskAssessment?: string;
    severity?: number;
    commonality?: string;
  };
}
