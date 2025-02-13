export interface Transaction {
  timestamp: string;
  value: string;
  direction: 'sent' | 'received'; 
  hash: string;
  tokenName?: string;
  tokenSymbol: string;
  type: 'eth' | 'erc20';
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


export interface Pnl {
  totalCountOfTrades: number;
  totalTradeVolume: string;
  totalRealizedProfitUsd: string;
  totalRealizedProfitPercentage: number;
  totalBuys: number;
  totalSells: number;
  totalSoldVolumeUsd: string;
  totalBoughtVolumeUsd: string;
}