'use server'

import { performContractAudit } from '@/services/gemini'
import { fetchContractSourceCode } from '@/services/etherscan'
import { fetchTokenData } from '@/services/goplus-labs'
import { AuditResults } from '@/types/audit'

interface AuditTokenParams {
  contractAddress: string
  blockchain: string
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
    // Fetch source code and token data in parallel
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
    return {
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
  } catch (error) {
    console.error('Error in auditToken:', error)
    throw error
  }
} 