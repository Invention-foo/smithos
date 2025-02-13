'use server'

import { GoogleGenerativeAI } from "@google/generative-ai"
import { Json } from '@/types/supabase'
import JSON5 from 'json5'
import { AuditResults } from '@/types/audit'

interface AuditResult {
  isScam: boolean;
  codeAudit: {
    vulnerabilities: Array<{
      type: string
      severity: string
      description: string
      location: string
      codeSnippet: string
      remediation: string
    }>
  }
  maliciousCodeDetection: {
    malicious_code: Array<{
      type: string
      description: string
      location: string
      impact: string
      resolution: string
      resolvableByRenouncingOwnership: boolean
    }>
  }
  tokenomicsAndTradingFunctionalityAudit: {
    tokenomics: {
      supply: {
        total: number | null
        description: string
      }
      taxes: {
        buy: {
          startingPercentage: number | null
          finalPercentage: number | null
          purpose: string
          description: string
        }
        sell: {
          startingPercentage: number | null
          finalPercentage: number | null
          purpose: string
          description: string
        }
        transfer: {
          startingPercentage: number | null
          finalPercentage: number | null
          purpose: string
          description: string
        }
      }
      burning: {
        amountPercent: number | null
        description: string
      }
      minting: {
        description: string
      }
      antiWhale: {
        description: string
      }
      walletLimits: {
        maxTransactionAmountPercent: number | null
        maxWalletPercent: number | null
        description: string
      }
    }
  }
  riskAssessmentAndSummary: {
    summary: string
    commonality: {
      description: string
      riskImplications: string
    }
    maliciousPotential: {
      description: string
      investorImpact: string
    }
    overallRisk: string
    conclusion: string
  }
}

function isValidAuditResult(result: any): result is AuditResult {
  return (
    result &&
    typeof result === 'object' &&
    'codeAudit' in result &&
    'maliciousCodeDetection' in result &&
    'tokenomicsAndTradingFunctionalityAudit' in result &&
    'riskAssessmentAndSummary' in result
  )
}

interface GeminiAuditResponse {
  auditResult: AuditResult;
  rawJson: Json;  // For Supabase storage
}

export async function performContractAudit(sourceCode: string): Promise<GeminiAuditResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "Objective: Conduct a comprehensive audit of the provided EVM smart contract, covering code security, malicious code detection, tokenomics, and overall risk assessment. The audit should be structured in four sections, with JSON formatted outputs for all sections.\r\n\r\nSection 1: Code Audit\r\n\r\nInput: The EVM smart contract source code (Solidity, Vyper, etc.).\r\n\r\nTasks:\r\n\r\nIdentify potential vulnerabilities (reentrancy, overflow\/underflow, denial of service, access control issues, etc.).\r\n\r\nAnalyze code style and adherence to best practices (e.g., using SafeMath, proper error handling, avoiding unchecked loops).\r\n\r\nDetect any known exploit patterns or common vulnerabilities.\r\n\r\nDocument all identified risks with severity levels (critical, high, medium, low) and provide remediation recommendations.\r\n\r\nInclude specific line numbers and code snippets illustrating the vulnerabilities.\r\n\r\nOutput: A JSON object representing the entire output of this section. The structure is flexible to accommodate the varying nature of vulnerabilities found. Example:\r\n\r\n```json\r\n{\r\n  \"vulnerabilities\": [\r\n    {\r\n      \"type\": \"Reentrancy\",\r\n      \"severity\": \"Critical\",\r\n      \"description\": \"A detailed description of the reentrancy vulnerability...\",\r\n      \"location\": \"Lines 100-110\",\r\n      \"codeSnippet\": \"...relevant code snippet...\",\r\n      \"remediation\": \"Recommended steps to fix the vulnerability...\"\r\n    },\r\n    {\r\n      \"type\": \"Integer Overflow\",\r\n      \"severity\": \"High\",\r\n      \"description\": \"...\",\r\n      \"location\": \"...\",\r\n      \"codeSnippet\": \"...\",\r\n      \"remediation\": \"...\"\r\n    }\r\n  ]\r\n}\r\n```\r\n\r\nSection 2: Malicious Code Detection\r\n\r\nInput: The EVM smart contract source code (same as Section 1).\r\n\r\nTasks:\r\nIdentify potential malicious code patterns and design flaws that could enable malicious behavior, excluding vulnerabilities resulting from compromised accounts (owner, deployer, tax wallets, etc.). Focus on vulnerabilities inherent in the contract's code itself. This includes, but is not limited to:\r\n\r\nHoneypots: Mechanisms designed to attract and trap users, including designs that allow for the creation of a honeypot through post-deployment manipulation. Consider only vulnerabilities that exist regardless of account compromise.\r\nRug Pulls: Mechanisms designed to drain funds from investors. Analyze only code-level mechanisms, not those reliant on compromised accounts.\r\nBackdoors: Hidden access points allowing unauthorized control. Focus on backdoors built into the contract's logic, not those exploitable through compromised keys.\r\nOther malicious patterns: Any other code designed to defraud or harm users, or designs that could be easily adapted for malicious purposes. Exclude scenarios where the malicious behavior relies solely on compromised accounts.\r\n\r\nAnalyze the contract's functionality to determine if its design could be easily adapted for malicious purposes, even if no explicit malicious code is currently present. Again, focus on vulnerabilities inherent in the code, not those dependent on account compromise.\r\nProvide a resolution for each detected malicious code pattern or design flaw in the context of post-deployment manipulation. Any time a pattern is detected that can be resolved by renouncing ownership, include that as a resolution. If renouncing ownership is not a viable resolution for potential malicious patterns and code MUST be removed, assume it's intentionally malicious and warn the investors in the resolution.\r\n\r\nIMPORTANT: Remember, if a detected pattern can be mitigated by renouncing ownership, mention it in the resolution and ensure resolvableByRenouncingOwnership is set to true.\r\n\r\nOutput: A JSON array of objects, each representing a detected malicious code pattern or design flaw that could enable malicious behavior.  The structure MUST be consistent as shown below:\r\n\r\n```json\r\n{\r\n\"malicious_code\": [\r\n  {\r\n    \"type\": \"Rug Pull\",\r\n    \"description\": \"A detailed description of the rug pull mechanism...\",\r\n    \"location\": \"Lines 200-215\",\r\n    \"impact\": \"Complete loss of investor funds.\",\r\n    \"resolution\": \"...\",\r\n    \"resolvableByRenouncingOwnership\": true\/false \r\n  },\r\n  {\r\n    \"type\": \"Potential Honeypot\",\r\n    \"description\": \"A description explaining how the contract's design could be manipulated to function as a honeypot after deployment.\",\r\n    \"location\": \"...relevant lines...\",\r\n    \"impact\": \"...potential impact on investors...\",\r\n    \"resolution\": \"...\",\r\n    \"resolvableByRenouncingOwnership\": true\/false \r\n  }\r\n  ]\r\n}\r\n\r\nSection 3: Tokenomics and Trading Functionality Audit for Investors\r\n\r\nInput: The EVM smart contract source code (same as Section 1).\r\n\r\nTasks: Analyze the following aspects, providing numerical values where applicable. If a feature is not present, provide a description explaining its absence.\r\n\r\nToken Supply and Distribution\r\n\r\nBuy\/Sell\/Transfer Taxes (include starting and final tax rates if applicable)\r\n\r\nToken Burning and Minting Mechanisms\r\n\r\nAnti-Whale Mechanisms\r\n\r\nWallet Limits\r\n\r\nProject Longevity and Sustainability\r\n\r\nOutput: A JSON object. Numerical values should be included where available. If a feature is not present, include a \"description\" field explaining its absence. The structure should allow for nested descriptions as needed. Make sure to include each of the above aspects being analyzed in the JSON object, and adhere to the structure in the JSON example below. If a value is N\/A or not applicable, use null. The total supply should be presented as the full number, not in scientific notation.\r\n\r\nExample:\r\n\r\n```json\r\n{\r\n  \"tokenomics\": {\r\n    \"supply\": {\r\n      \"total\": \"N\/A\",\r\n      \"description\": \"Total supply is not defined in the contract.\"\r\n    },\r\n    \"taxes\": {\r\n        \"buy\": {\r\n          \"startingPercentage\": \"Variable\",\r\n          \"finalPercentage\": \"Variable\",\r\n          \"purpose\": \"Marketing, Team, Community, Liquidity\",\r\n          \"description\": \"Taxes are defined by the `taxInfo` struct and can be adjusted by the owner.  The liquidity tax is dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\r\n        },\r\n        \"sell\": {\r\n          \"startingPercentage\": \"Variable\",\r\n          \"finalPercentage\": \"Variable\",\r\n          \"purpose\": \"Marketing, Team, Community, Liquidity\",\r\n          \"description\": \"Taxes are the same as buy taxes, defined by the `taxInfo` struct and can be adjusted by the owner.  The liquidity tax is dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\r\n        },\r\n        \"transfer\": {\r\n          \"startingPercentage\": \"Variable\",\r\n          \"finalPercentage\": \"Variable\",\r\n          \"purpose\": \"Marketing, Team, Community, Liquidity\",\r\n          \"description\": \"Taxes are the same as buy and sell taxes, defined by the `taxInfo` struct and can be adjusted by the owner.  The liquidity tax is dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\r\n        }\r\n      },\r\n      \"burning\": {\r\n        \"amountPercent\": 0,\r\n        \"description\": \"No explicit token burning mechanism is implemented.\"\r\n      },\r\n      \"minting\": {\r\n        \"description\": \"No explicit token minting mechanism is implemented after the initial supply.\"\r\n      },\r\n      \"antiWhale\": {\r\n        \"description\": \"A `maxTokensPerWallet` limit is implemented, but can be disabled by the owner.  The limit is also dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\r\n      },\r\n      \"walletLimits\": {\r\n        \"maxTransactionAmountPercent\": 2,\r\n        \"maxWalletPercent\": 2,\r\n        \"description\": \"Maximum transaction amount is 2% of total supply, and maximum wallet size is 2% of total supply.\"\r\n      },\r\n      \"projectLongevity\": {\r\n        \"description\": \"The project's longevity depends on factors outside the scope of this audit, such as community engagement, marketing efforts, and the overall utility of the token.\"\r\n      }\r\n    }\r\n  }\r\n}\r\n```\r\n\r\nSection 4: Risk Assessment and Summary\r\n\r\nInput: Findings from Sections 1, 2, and 3.\r\n\r\nTasks:\r\n\r\nSummarize the overall findings of the smart contract audit.\r\n\r\nDetermine whether the contract's design and functionality are similar to commonly used patterns or represent a unique approach. Explain the implications for risk assessment.\r\n\r\nAssess the potential for malicious use of the contract based on its functionality and identified vulnerabilities. Explain the potential impact on investors.\r\n\r\nProvide a concise overall risk assessment and a high-level conclusion suitable for an investor from the perspective of whether the token is a scam or not. Unless the codeAudit is extremely severe, don't factor that into the high-level conclusion. If the maliciousPotential patterns can all be resolved by renouncing ownership, reduce the risk assessment.\r\n\r\nOutput: A JSON object with the following structure:\r\n\r\n```json\r\n{\r\n  \"summary\": \"A concise summary of the audit findings.\",\r\n  \"commonality\": {\r\n    \"description\": \"Description of whether the contract's design and functionality are similar to commonly used patterns or represent a unique approach.\",\r\n    \"riskImplications\": \"Explanation of the implications for risk assessment.\"\r\n  },\r\n  \"maliciousPotential\": {\r\n    \"description\": \"Assessment of the potential for malicious use of the contract.\",\r\n    \"investorImpact\": \"Explanation of the potential impact on investors.\"\r\n  },\r\n  \"overallRisk\": \"A concise overall risk assessment.\",\r\n  \"conclusion\": \"A high-level conclusion suitable for an investor.\"\r\n}\r\n```\r\n\r\nThe final output should be a JSON object that contains the results of the audit from all four sections. Example:\r\n\r\n```json\r\n{\r\n  \"codeAudit\": { section 1 },\r\n  \"maliciousCodeDetection\": { section 2 },\r\n  \"tokenomicsAndTradingFunctionalityAudit\": { section 3 },\r\n  \"riskAssessmentAndSummary\": { section 4 }\r\n}\r\n```",
    generationConfig: {
      temperature: 0.15,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 16384,
    }
  })

  try {
    const chat = model.startChat({
      history: [],
    })

    const result = await chat.sendMessage(sourceCode)
    const response = result.response.text()
    
    console.log('Raw Gemini response:', response)

    try {
      // Extract JSON from markdown code block if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : response

      // Parse with JSON5 which is more forgiving
      const parsedResponse = JSON5.parse(jsonString)
      
      if (!isValidAuditResult(parsedResponse)) {
        throw new Error('Invalid audit result structure')
      }

      // Add post-processing for isScam
      let isScam = false;
      for (const maliciousItem of parsedResponse.maliciousCodeDetection.malicious_code) {
        if (!maliciousItem.resolvableByRenouncingOwnership) {
          isScam = true;
          break;
        }
      }
      parsedResponse.isScam = isScam;

      return {
        auditResult: parsedResponse,
        rawJson: parsedResponse as unknown as Json
      }

    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      throw new Error(`Failed to parse audit results`)
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
} 