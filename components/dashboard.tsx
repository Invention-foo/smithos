import React, { useState } from 'react';
import { X, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTokenHoldings } from "@/hooks/use-token-holdings";
import { useTransactions } from "@/hooks/use-transactions";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModalWrapper } from './modal-wrapper';

interface DashboardProps {
  onClose: () => void;
}

const formatEth = (value: string) => {
  const eth = Number.parseFloat(value) / 1e18
  return eth.toFixed(4)
}

export function Dashboard({ onClose }: DashboardProps) {
  const { tokens, isLoading: tokensLoading, error: tokensError } = useTokenHoldings();
  const { transactions, isLoading: txLoading, error: txError } = useTransactions();
  const totalValue = tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);
  
  const chartData = transactions.map((tx) => ({
    date: new Date(tx.date).toLocaleDateString(),
    value: tx.value,
  }));
  const [expandedTokens, setExpandedTokens] = useState<{[key: string]: boolean}>({});

  const toggleExpand = (symbol: string) => {
    setExpandedTokens(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  return (
    <ModalWrapper onClose={onClose} className="bg-gradient-to-b from-green-950 to-green-900 border border-green-400/30 shadow-xl p-8 rounded-xl w-[85vw] h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-green-300 mt-2">Portfolio Value: ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>
        <button onClick={onClose} className="text-green-400/80 hover:text-green-300 transition-colors">
          <X size={24} />
        </button>
      </div>

      {tokensLoading || txLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-pulse text-green-300">Loading portfolio data...</div>
        </div>
      ) : tokensError || txError ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/20">
            Error loading portfolio data
          </div>
        </div>
      ) : (
        <>
          <Card className="bg-green-900/50 border border-green-500 mb-4 w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Portfolio Activity</CardTitle>
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
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22543D" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6EE7B7"
                      tick={{ fill: '#6EE7B7' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#064E3B', 
                        border: '1px solid #10B981',
                        borderRadius: '6px'
                      }}
                      labelStyle={{ color: '#6EE7B7' }}
                      itemStyle={{ color: '#6EE7B7' }}
                      formatter={(value: any) => [Number.parseFloat(value.toString())]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-950/50 backdrop-blur-sm border-green-400/20 w-full shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-green-300">Digital Assets</CardTitle>
              <div className="text-green-300 text-sm">
                {tokens.length} Token{tokens.length === 1 ? '' : 's'} Found
              </div>
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
                            
                            <div className="col-span-2 mt-2">
                              <button 
                                onClick={() => toggleExpand(token.symbol)}
                                className="flex items-center gap-1 text-green-400/70 hover:text-green-400 transition-colors text-sm"
                              >
                                {expandedTokens[token.symbol] ? (
                                  <>
                                    <ChevronUp size={16} />
                                    <span>Show Less</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={16} />
                                    <span>Show More</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {expandedTokens[token.symbol] && (
                              <>
                                <div className="col-span-2 mt-2">
                                  <p className="text-xs text-green-400/70">Risk Assessment</p>
                                  <p className="text-sm text-green-300">
                                    {token.codeseerAudit.riskAssessment || 'No risk assessment available'}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-xs text-green-400/70">Code Commonality</p>
                                  <p className="text-sm text-green-300">
                                    {token.codeseerAudit.commonality || 'No commonality data available'}
                                  </p>
                                </div>
                              </>
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
