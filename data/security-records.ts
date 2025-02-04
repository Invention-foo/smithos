import type { SecurityRecords } from '@/types/security-records';

export const securityRecords: SecurityRecords = {
  records: [
    {
      id: "1",
      title: "CRITICAL: Smart Contract Honeypot Detection",
      severity: "CRITICAL" as const,
      timestamp: "2199-07-21T15:31:23Z",
      status: "ACTIVE" as const,
      content: "[DEMO ENTRY - NOT A REAL SECURITY ALERT]\nThis is a demonstration entry to show the structure and formatting of security records.\n--------------------------------------------------------------------\n\n[SECURITY ALERT]\nTimestamp: 2199-07-21T15:31:23Z\nThreat Level: CRITICAL\nStatus: ACTIVE\n\nTarget: Unknown Farming Protocol\nSignature: 0x7f1e...a3b9\n\n[ANALYSIS]\nAgent Smith has identified a malicious smart contract deployment exhibiting honeypot characteristics.\nContract employs sophisticated obfuscation techniques to conceal fund-trapping mechanisms.\n\n[TECHNICAL DETAILS]\n- Complex external call chain detected\n- Suspicious token approval requirements\n- Hidden admin functions identified\n- Blacklisted address manipulation\n\n[RECOMMENDATION]\n>>> IMMEDIATE ACTION REQUIRED\n>>> BLACKLIST CONTRACT ADDRESS\n>>> ALERT ALL CONNECTED NODES"
    }
  ]
}; 