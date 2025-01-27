import { Json } from "@/types/supabase"

interface TokenMetadata {
  name: string | null
  symbol: string | null
}

interface LiveAuditData {
  name: string | null
  symbol: string | null
  totalSupply: string
  buyTax: number
  sellTax: number
  ownershipRenounced: boolean
  lpLocked: boolean
  lastUpdated: string
}

interface GoPlusLabsResponse {
  code: number
  message: string
  result: {
    [key: string]: {
      token_name: string
      token_symbol: string
      total_supply: string
      buy_tax: string
      sell_tax: string
      owner_address: string
      lp_holders?: Array<{
        is_locked: number
        address: string
        percent: string
      }>
    }
  }
}

interface TokenData {
  metadata: TokenMetadata
  liveAudit: LiveAuditData
  rawResponse: Json
}

const DEAD_ADDRESSES = [
  '0x000000000000000000000000000000000000dead',
  '0x0000000000000000000000000000000000000000',
  '0xdead000000000000000000000000000000000000',
  '0xffffffffffffffffffffffffffffffffffffffff'
].map(addr => addr.toLowerCase())

export async function fetchTokenData(
  contractAddress: string, 
  chainId: string
): Promise<TokenData | null> {
  const chainMap: Record<string, string> = {
    'ethereum': '1',
    'bsc': '56',
  }

  const chain = chainMap[chainId.toLowerCase()]
  if (!chain) {
    throw new Error(`Unsupported blockchain: ${chainId}`)
  }

  try {
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${chain}?contract_addresses=${contractAddress}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: GoPlusLabsResponse = await response.json()
    
    if (data.code !== 1 || !data.result || !data.result[contractAddress.toLowerCase()]) {
      return null
    }

    const tokenData = data.result[contractAddress.toLowerCase()]
    
    // Check if any LP holder has locked tokens
    const hasLockedLp = tokenData.lp_holders?.some(holder => holder.is_locked === 1) ?? false

    // Check if owner address is a dead address
    const ownerAddress = tokenData.owner_address.toLowerCase()
    const isOwnershipRenounced = DEAD_ADDRESSES.includes(ownerAddress)

    return {
      metadata: {
        name: tokenData.token_name || null,
        symbol: tokenData.token_symbol || null
      },
      liveAudit: {
        name: tokenData.token_name || null,
        symbol: tokenData.token_symbol || null,
        totalSupply: tokenData.total_supply,
        buyTax: parseFloat(tokenData.buy_tax) * 100, // Convert to percentage
        sellTax: parseFloat(tokenData.sell_tax) * 100, // Convert to percentage
        ownershipRenounced: isOwnershipRenounced,
        lpLocked: hasLockedLp,
        lastUpdated: new Date().toISOString()
      },
      rawResponse: data as unknown as Json
    }
  } catch (error) {
    console.error('Error fetching token data from GoPlus Labs:', error)
    return null
  }
}

export function getBlockchainFromChainId(chainId: string): string {
  const chainMap: Record<string, string> = {
    '1': 'ethereum',
    '56': 'bsc',
    // Add more chains as needed
  }
  
  return chainMap[chainId] || 'unknown'
} 