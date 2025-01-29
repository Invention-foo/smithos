import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TokenomicsData } from "@/types/audit"

interface TokenomicsProps {
  data: TokenomicsData
}

export function Tokenomics({ data }: TokenomicsProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const formatTaxInfo = (tax: { 
    startingPercentage: number | null, 
    finalPercentage: number | null, 
    purpose: string, 
    description: string 
  }) => {
    const start = tax.startingPercentage !== null ? `${tax.startingPercentage}%` : 'N/A'
    const final = tax.finalPercentage !== null ? `${tax.finalPercentage}%` : 'N/A'
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-green-300">Tax:</span>
          {start === final ? (
            <span className="text-green-100">{start}</span>
          ) : (
            <span className="text-green-100">{start} → {final}</span>
          )}
        </div>
        <div className="text-sm">
          <span className="font-medium text-green-300">Purpose: </span>
          <span className="text-green-100">{tax.purpose || 'Not specified'}</span>
        </div>
        <div className="text-sm text-green-200">{tax.description}</div>
      </div>
    )
  }

  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h3 className="text-lg font-semibold text-green-300">Tokenomics Analysis</h3>
        <span className="text-green-300">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Taxes */}
          <div className="space-y-4">
            <div className="bg-green-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-200 mb-4">Taxes</h4>
              <div className="space-y-6">
                <div>
                  <div className="font-medium text-green-200 mb-2">Buy Tax</div>
                  {formatTaxInfo(data.taxes.buy)}
                </div>
                <div>
                  <div className="font-medium text-green-200 mb-2">Sell Tax</div>
                  {formatTaxInfo(data.taxes.sell)}
                </div>
                <div>
                  <div className="font-medium text-green-200 mb-2">Transfer Tax</div>
                  {formatTaxInfo(data.taxes.transfer)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Other Details */}
          <div className="space-y-4">
            <div className="bg-green-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-200 mb-2">Supply</h4>
              <div className="text-sm text-green-100">{data.supply.description}</div>
            </div>

            <div className="bg-green-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-200 mb-2">Anti-Whale Measures</h4>
              <div className="text-sm text-green-100">{data.antiWhale.description}</div>
            </div>
            
            <div className="bg-green-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-200 mb-2">Wallet Limits</h4>
              <div className="text-sm text-green-100">{data.walletLimits.description}</div>
            </div>
            
            <div className="bg-green-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-200 mb-2">Token Mechanics</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-green-300">Burning: </span>
                  <span className="text-green-100">{data.burning.description}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-green-300">Minting: </span>
                  <span className="text-green-100">{data.minting.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 