export interface SecurityRecord {
  id: string;
  title: string;
  content: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED' | 'MONITORING';
}

export interface SecurityRecords {
  records: SecurityRecord[];
} 