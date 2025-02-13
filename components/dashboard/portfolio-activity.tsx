import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePnl } from "@/hooks/use-pnl";
import { useTokenHoldings } from "@/hooks/use-token-holdings";
import { Token } from "@/types/wallet";
import { DollarSign, TrendingUp, BarChart2, ArrowLeftRight } from 'lucide-react';

export function PortfolioActivity() {
  const { tokens, isLoading: tokensLoading, error: tokensError } = useTokenHoldings();
  const { pnl, isLoading: pnlLoading, error: pnlError } = usePnl();

  if (tokensLoading || pnlLoading) {
    return (
      <Card className="bg-green-900/50 border border-green-500 mb-4 w-full flex flex-col md:flex-row">
        <CardContent className="text-center text-green-300">Loading chart data...</CardContent>
      </Card>
    );
  }
  if (tokensError || pnlError) return null;

  const chartData = processTokenHoldings(tokens);

  return (
    <Card className="bg-green-900/50 border border-green-500 mb-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-semibold text-green-200">Portfolio Activity</CardTitle>
        <TooltipProvider>
          <UiTooltip>
            <TooltipTrigger asChild>
              <Info size={16} className="text-green-400/70 hover:text-green-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="bg-green-950/90 border border-green-400/30 p-3">
              <p className="text-green-300">Shows daily transaction volume and balance changes</p>
            </TooltipContent>
          </UiTooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row w-full p-4 gap-4">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          {pnl && <PnLSummary pnl={pnl} />}
        </div>
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                label={({ name, value, percent }) => 
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`hsl(${index * (360 / chartData.length)}, 80%, 65%)`}
                    stroke="hsl(var(--green-950))"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                contentStyle={{ 
                  background: 'hsl(var(--green-950))', 
                  color: 'hsl(var(--green-300))', 
                  border: '1px solid hsl(var(--green-400))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }} 
              />
              <Legend 
                layout="vertical" 
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ 
                  color: 'hsl(var(--green-300))',
                  paddingLeft: '20px',
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function PnLSummary({ pnl }: { pnl: any }) {
  const summaryItems = [
    {
      label: "Total Profit/Loss",
      value: `$${parseFloat(pnl.totalRealizedProfitUsd).toFixed(2)}`,
      subValue: `(${pnl.totalRealizedProfitPercentage?.toFixed(2) || 0}%)`,
      icon: TrendingUp,
    },
    {
      label: "Trade Volume",
      value: `$${parseFloat(pnl.totalTradeVolume).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Total Trades",
      value: pnl.totalCountOfTrades,
      subValue: `${pnl.totalBuys} buys / ${pnl.totalSells} sells`,
      icon: BarChart2,
    },
    {
      label: "Buy/Sell Volume",
      value: `$${parseFloat(pnl.totalBoughtVolumeUsd).toFixed(2)}`,
      subValue: `/ $${parseFloat(pnl.totalSoldVolumeUsd).toFixed(2)}`,
      icon: ArrowLeftRight,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-green-400/20 bg-green-900/40 p-4 hover:bg-green-900/60 transition-colors backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-900/60 p-2">
                <Icon className="h-5 w-5 text-green-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-400/70">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold text-green-100">{item.value}</h3>
                  {item.subValue && (
                    <span className="text-sm text-green-300">{item.subValue}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function processTokenHoldings(tokens: Token[]) {
  return tokens
    .filter(token => token.usdValue !== undefined && token.usdValue > 0)
    .map(token => ({
      name: token.symbol,
      value: token.usdValue ? parseFloat(token.usdValue.toFixed(2)) : 0
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending
}
