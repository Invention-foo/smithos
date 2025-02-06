'use server'

import { performContractAudit } from '@/services/gemini'
import { fetchContractSourceCode } from '@/services/etherscan'
import { fetchTokenData } from '@/services/goplus-labs'
import { AuditResults, StoredAuditResult } from '@/types/audit'
import { supabase } from '@/lib/supabase'

interface AuditTokenParams {
  contractAddress: string
  blockchain: string
}

async function getStoredAudit(contractAddress: string, blockchain: string) {
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

async function storeAuditResult(
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

async function performAudit(sourceCode: string) {
  if (!sourceCode) {
    throw new Error('Source code is required for audit')
  }

  try {
    const { auditResult } = await performContractAudit(sourceCode)
    
    console.log('Raw Gemini response:', auditResult)
    
    const transformedData = {
      riskAssessment: auditResult.riskAssessmentAndSummary,
      codeAudit: auditResult.codeAudit.vulnerabilities,
      maliciousPatterns: auditResult.maliciousCodeDetection.malicious_code,
      tokenomics: auditResult.tokenomicsAndTradingFunctionalityAudit.tokenomics,
      isScam: auditResult.isScam
    }
    
    console.log('Transformed data:', transformedData)
    
    return transformedData
  } catch (error) {
    console.error('Error performing audit:', error)
    throw new Error('Failed to perform contract audit')
  }
}

export async function auditToken({ 
  contractAddress, 
  blockchain 
}: AuditTokenParams): Promise<AuditResults> {
  try {
    // Check if we have a stored audit result
    const storedAudit = await getStoredAudit(contractAddress, blockchain)
    
    if (storedAudit) {
      // Return stored audit result with live data
      const tokenData = await fetchTokenData(contractAddress, blockchain)
      return {
        ...storedAudit.audit_result,
        liveAudit: tokenData?.liveAudit ?? {
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
    }

    // If no stored audit exists, perform a new audit
    const [sourceCode, tokenData] = await Promise.all([
      fetchContractSourceCode(contractAddress),
      fetchTokenData(contractAddress, blockchain)
    ])
    
    if (!sourceCode) {
      throw new Error('Contract source code not found or not verified')
    }
    
    // Get the audit results
    const auditResult = await performAudit(sourceCode)
    
    // Merge live token data with audit results
    const fullAuditResult = {
      ...auditResult,
      liveAudit: tokenData?.liveAudit ?? {
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

    // Store the audit result
    await storeAuditResult(contractAddress, blockchain, {
      riskAssessment: auditResult.riskAssessment,
      codeAudit: auditResult.codeAudit,
      maliciousPatterns: auditResult.maliciousPatterns,
      tokenomics: auditResult.tokenomics,
      isScam: auditResult.isScam
    })
    
    return fullAuditResult
  } catch (error) {
    console.error('Error in auditToken:', error)
    throw error
  }
} 