'use server'

import { ContractAuditService } from '@/services/contract-audit'
import { AuditResults } from '@/types/audit'

interface AuditTokenParams {
  contractAddress: string
  blockchain: string
  userKey: string
}

export async function auditToken({ 
  contractAddress, 
  blockchain,
  userKey 
}: AuditTokenParams): Promise<AuditResults> {
  return ContractAuditService.auditContract(
    contractAddress,
    blockchain,
    userKey,
    'CODESEER'
  )
} 