import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TokenomicsData, LiveAuditData } from "@/types/audit"

interface TokenomicsProps {
  data: TokenomicsData
  liveAudit?: LiveAuditData
}

export function Tokenomics({ data, liveAudit }: TokenomicsProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const formatTaxInfo = (tax: { 
    startingPercentage: number | null, 
    finalPercentage: number | null, 
    purpose: string, 
    description: string 
  }) => {
    const formatValue = (value: number | null) => {
      if (value === null) return 'N/A';
      return value === -1 ? 'Variable' : `${value}%`;
    }
    
    const start = formatValue(tax.startingPercentage);
    const final = formatValue(tax.finalPercentage);
    
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

  const LiveAuditSection = () => {
    if (!liveAudit) return null;
    
    return (
      <div className="bg-green-900/50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-green-200 mb-2">Live Token Data</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-green-300">Buy Tax</p>
            <p className="text-lg text-green-100">{liveAudit.buyTax}%</p>
          </div>
          <div>
            <p className="text-sm text-green-300">Sell Tax</p>
            <p className="text-lg text-green-100">{liveAudit.sellTax}%</p>
          </div>
          <div>
            <p className="text-sm text-green-300">Ownership Status</p>
            <p className="text-lg text-green-100">
              {liveAudit.ownershipRenounced ? 'Renounced' : 'Not Renounced'}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-300">Liquidity Status</p>
            <p className="text-lg text-green-100">
              {liveAudit.lpLocked ? 'Locked' : 'Not Locked'}
            </p>
          </div>
        </div>
      </div>
    );
  };

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
        <>
          <LiveAuditSection />
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
        </>
      )}
    </div>
  )
} 