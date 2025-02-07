'use server'

import { auditContract, batchAuditContracts } from '@/services/contract-audit'
import { AuditResults } from '@/types/audit'

interface AuditTokenParams {
  contractAddress: string
  blockchain: string
  userKey: string
}

interface BatchAuditTokenParams {
  contracts: Array<{ address: string, blockchain: string }>
  userKey: string,
  chainId?: string
}

export async function auditToken({ 
  contractAddress, 
  blockchain,
  userKey 
}: AuditTokenParams): Promise<AuditResults> {
  return auditContract(
    contractAddress,
    blockchain,
    userKey,
    'CODESEER'
  )
} 

export async function batchAuditTokens({
  contracts,
  userKey,
  chainId
}: BatchAuditTokenParams): Promise<Record<string, AuditResults>> {
  return batchAuditContracts(contracts, userKey, chainId)
}