'use server'

import { isRateLimited } from './rate-limiter'

interface EtherscanResponse {
  status: string
  message: string
  result: {
    SourceCode: string
    ABI: string
    ContractName: string
    CompilerVersion: string
    OptimizationUsed: string
    Runs: string
    ConstructorArguments: string
    EVMVersion: string
    Library: string
    LicenseType: string
    Proxy: string
    Implementation: string
    SwarmSource: string
  }[]
}

export async function fetchContractSourceCode(contractAddress: string, chainId?: string, userKey: string = 'default'): Promise<string | null> {
  const { limited, waitTime } = await isRateLimited(userKey, 'ETHERSCAN')
  if (limited) {
    throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds before making more requests.`)
  }

  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

  if (!ETHERSCAN_API_KEY) {
    throw new Error('ETHERSCAN_API_KEY environment variable is not set.')
  }

  const params = new URLSearchParams({
    module: 'contract',
    action: 'getsourcecode',
    address: contractAddress,
    chainId: chainId || '1',
    apikey: ETHERSCAN_API_KEY
  })

  console.log(params.toString())

  try {
    const response = await fetch(
      `https://api.etherscan.io/v2/api?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )
    console.log(response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: EtherscanResponse = await response.json()

    if (data.status === '0') {
      console.error('Etherscan API error:', data.message)
      return null
    }

    if (!data.result?.[0]?.SourceCode) {
      console.error('No source code found for contract')
      return null
    }

    return data.result[0].SourceCode
  } catch (error) {
    console.error('Error fetching source code from Etherscan:', error)
    return null
  }
} 