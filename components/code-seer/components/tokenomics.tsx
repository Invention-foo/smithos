interface TokenomicsProps {
  data: {
    supply: {
      total: string | null
      description: string
    }
    taxes: {
      buy: { amount: number; description: string }
      sell: { amount: number; description: string }
      transfer: { amount: number; description: string }
    }
    burning: {
      amountPercent: number
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
    projectLongevity: {
      description: string
    }
  }
}

export function Tokenomics({ data }: TokenomicsProps) {
  return (
    <div className="bg-green-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-green-300 mb-2">Tokenomics Analysis</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-green-200 font-semibold">Supply</h4>
          <p className="text-green-100">{data.supply.description}</p>
        </div>

        <div>
          <h4 className="text-green-200 font-semibold">Taxes</h4>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-green-100">Buy: {data.taxes.buy.amount}%</p>
              <p className="text-sm text-green-300">{data.taxes.buy.description}</p>
            </div>
            <div>
              <p className="text-green-100">Sell: {data.taxes.sell.amount}%</p>
              <p className="text-sm text-green-300">{data.taxes.sell.description}</p>
            </div>
            <div>
              <p className="text-green-100">Transfer: {data.taxes.transfer.amount}%</p>
              <p className="text-sm text-green-300">{data.taxes.transfer.description}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-green-200 font-semibold">Token Mechanics</h4>
          <div className="space-y-2">
            <p className="text-green-100">Burning: {data.burning.amountPercent}%</p>
            <p className="text-sm text-green-300">{data.burning.description}</p>
            <p className="text-sm text-green-300">{data.minting.description}</p>
          </div>
        </div>

        <div>
          <h4 className="text-green-200 font-semibold">Wallet Restrictions</h4>
          <p className="text-sm text-green-300">{data.antiWhale.description}</p>
          <p className="text-sm text-green-300">{data.walletLimits.description}</p>
        </div>

        <div>
          <h4 className="text-green-200 font-semibold">Project Longevity</h4>
          <p className="text-sm text-green-300">{data.projectLongevity.description}</p>
        </div>
      </div>
    </div>
  );
} 