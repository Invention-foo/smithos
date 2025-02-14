'use server'

import { supabase } from '@/lib/supabase'
import { performContractAudit } from './gemini'
import { fetchContractSourceCode } from './etherscan'
import { fetchTokenData } from './goplus-labs'
import { AuditResults, StoredAuditResult } from '@/types/audit'
import { isRateLimited } from './rate-limiter'

function getDefaultLiveAudit() {
  return {
    name: null,
    symbol: null,
    totalSupply: null,
    buyTax: 0,
    sellTax: 0,
    ownershipRenounced: false,
    lpLocked: false,
    lastUpdated: new Date().toISOString()
  }
}

// Convert class methods to exported async functions
export async function getStoredAudits(contracts: Array<{ address: string, blockchain: string }>) {
  const { data, error } = await supabase
    .from('codeseer_audits')
    .select('*')
    .in('contract_address', contracts.map(c => c.address.toLowerCase()))
    .in('blockchain', contracts.map(c => c.blockchain.toLowerCase()))

  if (error) {
    console.error('Error fetching stored audits:', error)
    return []
  }

  return data as StoredAuditResult[]
}

export async function getStoredAudit(contractAddress: string, blockchain: string) {
  const { data, error } = await supabase
    .from('codeseer_audits')
    .select('*')
    .eq('contract_address', contractAddress.toLowerCase())
    .eq('blockchain', blockchain.toLowerCase())
    .single()

  if (error || !data) {
    return null
  }

  return data as StoredAuditResult
}

export async function storeAuditResult(
  contractAddress: string,
  blockchain: string,
  auditResult: Omit<AuditResults, 'liveAudit'>
) {
  const { error } = await supabase
    .from('codeseer_audits')
    .upsert({
      contract_address: contractAddress.toLowerCase(),
      blockchain: blockchain.toLowerCase(),
      audit_result: {
        riskAssessment: auditResult.riskAssessment,
        codeAudit: auditResult.codeAudit,
        maliciousPatterns: auditResult.maliciousPatterns,
        tokenomics: auditResult.tokenomics,
        isScam: auditResult.isScam
      },
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error storing audit result:', error)
  }
}

export async function auditContract(
  contractAddress: string,
  blockchain: string,
  userKey: string,
  type: 'CODESEER' | 'BATCH' = 'CODESEER',
  skipRateLimit = false,
  chainId?: string
): Promise<AuditResults> {
  if (!skipRateLimit) {
    const { limited, waitTime } = await isRateLimited(userKey, type)
    if (limited) {
      throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before making more requests.`)
    }
  }

  try {
    const storedAudit = await getStoredAudit(contractAddress, blockchain)
    
    if (storedAudit) {
      const tokenData = await fetchTokenData(contractAddress, blockchain)
      return {
        ...storedAudit.audit_result,
        liveAudit: tokenData?.liveAudit ?? getDefaultLiveAudit()
      }
    }

    const [sourceCode, tokenData] = await Promise.all([
      fetchContractSourceCode(contractAddress, chainId),
      fetchTokenData(contractAddress, blockchain)
    ])

    if (!sourceCode) {
      throw new Error('Contract source code not found or not verified')
    }

    const { auditResult } = await performContractAudit(sourceCode)
    
    const transformedData = {
      riskAssessment: auditResult.riskAssessmentAndSummary,
      codeAudit: auditResult.codeAudit.vulnerabilities,
      maliciousPatterns: auditResult.maliciousCodeDetection.malicious_code,
      tokenomics: auditResult.tokenomicsAndTradingFunctionalityAudit.tokenomics,
      isScam: auditResult.isScam
    }

    await storeAuditResult(contractAddress, blockchain, transformedData)

    return {
      ...transformedData,
      liveAudit: tokenData?.liveAudit ?? getDefaultLiveAudit()
    }
  } catch (error) {
    console.error('Error in auditContract:', error)
    throw error
  }
}

export async function batchAuditContracts(
  contracts: Array<{ address: string, blockchain: string }>,
  userKey: string,
  chainId?: string
): Promise<Record<string, AuditResults>> {
  const storedAudits = await getStoredAudits(contracts)
  const storedAuditsMap = new Map(
    storedAudits.map(audit => [`${audit.contract_address}-${audit.blockchain}`, audit])
  )

  const contractsToAudit = contracts.filter(contract => 
    !storedAuditsMap.has(`${contract.address.toLowerCase()}-${contract.blockchain.toLowerCase()}`)
  )

    // Fetch live data for all contracts in parallel
    const liveDataPromises = contracts.map(contract => 
      fetchTokenData(contract.address, contract.blockchain)
    )
    const liveDataResults = await Promise.allSettled(liveDataPromises)

    // Process new audits with rate limiting
    const results: Record<string, AuditResults> = {}

    // Process stored audits first
    for (const contract of contracts) {
      const key = `${contract.address.toLowerCase()}-${contract.blockchain.toLowerCase()}`
      const storedAudit = storedAuditsMap.get(key)
      
      if (storedAudit) {
        const index = contracts.findIndex(c => 
          c.address.toLowerCase() === contract.address.toLowerCase() && 
          c.blockchain.toLowerCase() === contract.blockchain.toLowerCase()
        )
        
        const liveData = liveDataResults[index].status === 'fulfilled' 
          ? (liveDataResults[index] as PromiseFulfilledResult<any>).value?.liveAudit 
          : getDefaultLiveAudit()

        results[contract.address] = {
          ...storedAudit.audit_result,
          liveAudit: liveData
        }
      }
    }

  // Process new audits
  for (const contract of contractsToAudit) {
    const { limited, waitTime } = await isRateLimited(userKey, 'BATCH')
    if (limited) {
      results[contract.address] = {
        error: `Rate limit exceeded. Please wait ${waitTime} seconds before making more requests.`
      } as any
      continue
    }

    try {
      const auditResult = await auditContract(
        contract.address,
        contract.blockchain,
        userKey,
        'BATCH',
        true,
        chainId
      )
      results[contract.address] = auditResult
    } catch (error) {
      results[contract.address] = {
        error: error instanceof Error ? error.message : 'Audit failed'
      } as any
    }
  }

  return results
} 