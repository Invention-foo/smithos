import React from 'react';
import { X, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { ModalWrapper } from "@/components/modal-wrapper"
import { useTokenHoldings } from "@/hooks/use-token-holdings";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1a1a1a;
    border-radius: 5px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2a2a2a;
  }
`;

const style = document.createElement('style');
style.textContent = customScrollbarStyles;
document.head.appendChild(style);


interface DashboardProps {
  onClose: () => void;
}

const assetValueData = [
  { date: '2023-01-01', value: 20000 },
  { date: '2023-02-01', value: 22000 },
  { date: '2023-03-01', value: 21000 },
  { date: '2023-04-01', value: 23000 },
  { date: '2023-05-01', value: 25000 },
  { date: '2023-06-01', value: 24000 },
  { date: '2023-07-01', value: 26000 },
  { date: '2023-08-01', value: 27000 },
  { date: '2023-09-01', value: 28000 },
  { date: '2023-10-01', value: 29000 },
  { date: '2023-11-01', value: 30000 },
  { date: '2023-12-01', value: 32000 },
  { date: '2024-01-01', value: 33000 },
];

export function Dashboard({ onClose }: DashboardProps) {
  const { tokens, isLoading, error } = useTokenHoldings();
  const totalValue = tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);

  return (
    <ModalWrapper onClose={onClose} className="bg-gradient-to-b from-green-950 to-green-900 border border-green-400/30 shadow-xl p-8 rounded-xl w-[85vw] h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Portfolio Dashboard</h2>
        <button onClick={onClose} className="text-green-400/80 hover:text-green-300 transition-colors">
          <X size={24} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-green-300">Loading portfolio data...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/20">
            Error loading portfolio data
          </div>
        </div>
      ) : (
        <>
          <Card className="bg-green-900/50 border border-green-500 mb-4 w-full">
            <CardHeader>
              <CardTitle>Asset Value Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[200px]">
                <ChartContainer config={{
                  value: {
                    label: "Value",
                    color: "hsl(var(--chart-1))",
                  },
                }} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={assetValueData} 
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <XAxis 
                        dataKey="date" 
                        stroke="var(--chart-color)" 
                        axisLine={false}
                        tickLine={false}
                        tick={false}
                      />
                      <YAxis 
                        stroke="var(--chart-color)" 
                        axisLine={false}
                        tickLine={false}
                        tick={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-green-900 border border-green-500 p-2 rounded">
                                <p className="text-green-300">{`Date: ${label}`}</p>
                                <p className="text-green-300">{`Value: $${payload[0]?.value?.toLocaleString()}`}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--chart-color)" 
                        fill="var(--chart-color)" 
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-950/50 backdrop-blur-sm border-green-400/20 w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-300">Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tokens.map((token) => (
                  <div 
                    key={token.symbol} 
                    className="p-4 rounded-lg bg-green-900/40 hover:bg-green-900/60 transition-colors backdrop-blur-sm border border-green-400/10"
                  >
                    <div className="flex justify-between items-start gap-4">
                      {/* Left section - Token basic info */}
                      <div className="flex items-start gap-4 min-w-[250px]">
                        {token.status && (
                          <TooltipProvider>
                            <UiTooltip>
                              <TooltipTrigger asChild>
                                <div className="mt-2">
                                  <div 
                                    className={`w-4 h-4 rounded-full ${
                                      token.status === 'green' ? 'bg-emerald-400' : 
                                      token.status === 'yellow' ? 'bg-amber-400' : 
                                      token.status === 'red' ? 'bg-red-400' : 'bg-gray-400'
                                    } shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-950/90 border border-green-400/30 p-4 rounded-lg shadow-xl backdrop-blur-sm z-50 max-w-md">
                                <div className="text-sm text-green-100 whitespace-pre-wrap leading-relaxed">
                                  {token.audit_report || "No audit report available"}
                                </div>
                              </TooltipContent>
                            </UiTooltip>
                          </TooltipProvider>
                        )}

                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <p className="text-lg font-bold text-green-100">{token.symbol}</p>
                            <p className="text-sm text-green-400/80">{token.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-green-300/80">Balance: {Number(token.balanceFormatted).toFixed(3)}</p>
                          </div>
                        </div>
                      </div>

                      {token.codeseerAudit ? (
                        <div className="flex-1 min-w-[300px] border-l border-r border-green-400/20 px-4">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="col-span-2 mb-2">
                              <div className="flex items-center gap-1 text-green-400/70">
                                <Info size={14} />
                                <span className="text-xs">More details can be found on CodeSeer</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-green-400/70">Malicious Patterns</p>
                              <p className="text-sm text-green-300">{token.codeseerAudit.maliciousPatterns || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-green-400/70">High Severity Issues</p>
                              <p className="text-sm text-green-300">{token.codeseerAudit.severity || 'N/A'}</p>
                            </div>
                            {token.codeseerAudit.riskAssessment ? (
                              <div className="col-span-2">
                                <p className="text-xs text-green-400/70">Risk Assessment</p>
                                <p className="text-sm text-green-300">{token.codeseerAudit.riskAssessment}</p>
                              </div>
                            ) : (
                              <div className="col-span-2">
                                <p className="text-xs text-green-400/70">Risk Assessment</p>
                                <p className="text-sm text-green-300">No risk assessment available</p>
                              </div>
                            )}
                            {token.codeseerAudit.commonality ? (
                              <div className="col-span-2">
                                <p className="text-xs text-green-400/70">Code Commonality</p>
                                <p className="text-sm text-green-300">{token.codeseerAudit.commonality}</p>
                              </div>
                            ) : (
                              <div className="col-span-2">
                                <p className="text-xs text-green-400/70">Code Commonality</p>
                                <p className="text-sm text-green-300">No commonality data available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-[300px] border-l border-r border-green-400/20 px-4">
                          <p className="text-sm text-green-300">No security report available</p>
                        </div>
                      )}

                      {/* Right section - Price info */}
                      <div className="text-right min-w-[150px]">
                        <p className="text-xl font-bold text-green-100">${token.usdValue?.toLocaleString() ?? '0'}</p>
                        <p className="text-sm text-green-300/80 mt-1">Price: ${token.usdPrice?.toLocaleString() ?? '0'}</p>
                        {token.price24hrPercentChange !== undefined && (
                          <p className={`text-sm font-medium mt-1 ${token.price24hrPercentChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {token.price24hrPercentChange >= 0 ? '↑' : '↓'} {Math.abs(token.price24hrPercentChange).toFixed(2)}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </ModalWrapper>
  );
}

