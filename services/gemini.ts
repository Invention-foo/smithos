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
    model: "gemini-1.5-flash",
    systemInstruction: "Objective: Conduct a comprehensive audit of the provided EVM smart contract, covering code security, malicious code detection, tokenomics, and overall risk assessment. The audit should be structured in four sections, with JSON formatted outputs for all sections.\n\nSection 1: Code Audit\n\nInput: The EVM smart contract source code (Solidity, Vyper, etc.).\n\nTasks:\n\nIdentify potential vulnerabilities (reentrancy, overflow/underflow, denial of service, access control issues, etc.).\n\nAnalyze code style and adherence to best practices (e.g., using SafeMath, proper error handling, avoiding unchecked loops).\n\nDetect any known exploit patterns or common vulnerabilities.\n\nDocument all identified risks with severity levels (critical, high, medium, low) and provide remediation recommendations.\n\nInclude specific line numbers and code snippets illustrating the vulnerabilities.\n\nOutput: A JSON object representing the entire output of this section. The structure is flexible to accommodate the varying nature of vulnerabilities found. Example:\n\n```json\n{\n  \"vulnerabilities\": [\n    {\n      \"type\": \"Reentrancy\",\n      \"severity\": \"Critical\",\n      \"description\": \"A detailed description of the reentrancy vulnerability...\",\n      \"location\": \"Lines 100-110\",\n      \"codeSnippet\": \"...relevant code snippet...\",\n      \"remediation\": \"Recommended steps to fix the vulnerability...\"\n    },\n    {\n      \"type\": \"Integer Overflow\",\n      \"severity\": \"High\",\n      \"description\": \"...\",\n      \"location\": \"...\",\n      \"codeSnippet\": \"...\",\n      \"remediation\": \"...\"\n    }\n  ]\n}\n```\n\nSection 2: Malicious Code Detection\n\nInput: The EVM smart contract source code (same as Section 1).\n\nTasks:\nIdentify potential malicious code patterns and design flaws that could enable malicious behavior, including but not limited to:\n\nHoneypots: Mechanisms designed to attract and trap users, including designs that allow for the creation of a honeypot through post-deployment manipulation.\nRug Pulls: Mechanisms designed to drain funds from investors.\nBackdoors: Hidden access points allowing unauthorized control.\nOther malicious patterns: Any other code designed to defraud or harm users, or designs that could be easily adapted for malicious purposes.\n\nAnalyze the contract's functionality to determine if its design could be easily adapted for malicious purposes, even if no explicit malicious code is currently present.\nProvide a resolution for each detected malicious code pattern or design flaw in the context of post-deployment manipulation. Any time a pattern is detected that can be resolved by renouncing ownership, include that as a resolution. For example, a potential rug pull due to blacklisting could be resolved by renouncing ownership or other measures. If renouncing ownership is not a viable resolution for potential malicious patterns and code MUST be removed, assume it's intentionally malicious and warn the investors in the resolution.\n\nOutput: A JSON array of objects, each representing a detected malicious code pattern or design flaw that could enable malicious behavior.  The structure MUST be consistent as shown below:\n\n```json\n{\n\"malicious_code\": [\n  {\n    \"type\": \"Rug Pull\",\n    \"description\": \"A detailed description of the rug pull mechanism...\",\n    \"location\": \"Lines 200-215\",\n    \"impact\": \"Complete loss of investor funds.\",\n    \"resolution\": \"...\"\n  },\n  {\n    \"type\": \"Potential Honeypot\",\n    \"description\": \"A description explaining how the contract's design could be manipulated to function as a honeypot after deployment.\",\n    \"location\": \"...relevant lines...\",\n    \"impact\": \"...potential impact on investors...\",\n    \"resolution\": \"...\"\n  }\n  ]\n}\n\nSection 3: Tokenomics and Trading Functionality Audit for Investors\n\nInput: The EVM smart contract source code (same as Section 1).\n\nTasks: Analyze the following aspects, providing numerical values where applicable. If a feature is not present, provide a description explaining its absence.\n\nToken Supply and Distribution\n\nBuy/Sell/Transfer Taxes (include starting and final tax rates if applicable)\n\nToken Burning and Minting Mechanisms\n\nAnti-Whale Mechanisms\n\nWallet Limits\n\nProject Longevity and Sustainability\n\nOutput: A JSON object. Numerical values should be included where available. If a feature is not present, include a \"description\" field explaining its absence. The structure should allow for nested descriptions as needed. Make sure to include each of the above aspects being analyzed in the JSON object, and adhere to the structure in the JSON example below. If a value is N/A or not applicable, use null. The total supply should be presented as the full number, not in scientific notation.\n\nExample:\n\n```json\n{\n  \"tokenomics\": {\n    \"supply\": {\n      \"total\": \"N/A\",\n      \"description\": \"Total supply is not defined in the contract.\"\n    },\n    \"taxes\": {\n        \"buy\": {\n          \"startingPercentage\": \"Variable\",\n          \"finalPercentage\": \"Variable\",\n          \"purpose\": \"Marketing, Team, Community, Liquidity\",\n          \"description\": \"Taxes are defined by the `taxInfo` struct and can be adjusted by the owner.  The liquidity tax is dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\n        },\n        \"sell\": {\n          \"startingPercentage\": \"Variable\",\n          \"finalPercentage\": \"Variable\",\n          \"purpose\": \"Marketing, Team, Community, Liquidity\",\n          \"description\": \"Taxes are the same as buy taxes, defined by the `taxInfo` struct and can be adjusted by the owner.  The liquidity tax is dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\n        },\n        \"transfer\": {\n          \"startingPercentage\": \"Variable\",\n          \"finalPercentage\": \"Variable\",\n          \"purpose\": \"Marketing, Team, Community, Liquidity\",\n          \"description\": \"Taxes are the same as buy and sell taxes, defined by the `taxInfo` struct and can be adjusted by the owner.  The liquidity tax is dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\n        }\n      },\n      \"burning\": {\n        \"amountPercent\": 0,\n        \"description\": \"No explicit token burning mechanism is implemented.\"\n      },\n      \"minting\": {\n        \"description\": \"No explicit token minting mechanism is implemented after the initial supply.\"\n      },\n      \"antiWhale\": {\n        \"description\": \"A `maxTokensPerWallet` limit is implemented, but can be disabled by the owner.  The limit is also dynamically adjusted based on the `totalEthAddedToLiquidity` variable.\"\n      },\n      \"walletLimits\": {\n        \"maxTransactionAmountPercent\": 2,\n        \"maxWalletPercent\": 2,\n        \"description\": \"Maximum transaction amount is 2% of total supply, and maximum wallet size is 2% of total supply.\"\n      },\n      \"projectLongevity\": {\n        \"description\": \"The project's longevity depends on factors outside the scope of this audit, such as community engagement, marketing efforts, and the overall utility of the token.\"\n      }\n    }\n  }\n}\n```\n\nSection 4: Risk Assessment and Summary\n\nInput: Findings from Sections 1, 2, and 3.\n\nTasks:\n\nSummarize the overall findings of the smart contract audit.\n\nDetermine whether the contract's design and functionality are similar to commonly used patterns or represent a unique approach. Explain the implications for risk assessment.\n\nAssess the potential for malicious use of the contract based on its functionality and identified vulnerabilities. Explain the potential impact on investors.\n\nProvide a concise overall risk assessment and a high-level conclusion suitable for an investor from the perspective of whether the token is a scam or not. Unless the codeAudit is extremely severe, don't factor that into the high-level conclusion. If the maliciousPotential patterns can all be resolved by renouncing ownership, reduce the risk assessment.\n\nOutput: A JSON object with the following structure:\n\n```json\n{\n  \"summary\": \"A concise summary of the audit findings.\",\n  \"commonality\": {\n    \"description\": \"Description of whether the contract's design and functionality are similar to commonly used patterns or represent a unique approach.\",\n    \"riskImplications\": \"Explanation of the implications for risk assessment.\"\n  },\n  \"maliciousPotential\": {\n    \"description\": \"Assessment of the potential for malicious use of the contract.\",\n    \"investorImpact\": \"Explanation of the potential impact on investors.\"\n  },\n  \"overallRisk\": \"A concise overall risk assessment.\",\n  \"conclusion\": \"A high-level conclusion suitable for an investor.\"\n}\n```\n\nThe final output should be a JSON object that contains the results of the audit from all four sections. Example:\n\n```json\n{\n  \"codeAudit\": { section 1 },\n  \"maliciousCodeDetection\": { section 2 },\n  \"tokenomicsAndTradingFunctionalityAudit\": { section 3 },\n  \"riskAssessmentAndSummary\": { section 4 }\n}\n```\n",
    generationConfig: {
      temperature: 0.15,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
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
        if (!maliciousItem.resolution.toLowerCase().includes("renouncing ownership") && 
            !maliciousItem.resolution.toLowerCase().includes("alternative equally effective mitigation")) {
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