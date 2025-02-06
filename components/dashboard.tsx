import React from 'react';
import { X } from 'lucide-react';
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
    <ModalWrapper onClose={onClose} className="bg-green-900 border border-green-500 p-6 rounded-lg w-[80vw] h-[80vh] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-500">Dashboard</h2>
        <button onClick={onClose} className="text-green-500 hover:text-green-400">
          <X size={24} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p className="text-green-300">Loading tokens...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8">
          <p className="text-red-400">Error loading tokens</p>
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

          <Card className="bg-green-900 border border-green-500 w-full">
            <CardHeader>
              <CardTitle>Token Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tokens.map((token) => (
                  <div 
                    key={token.symbol} 
                    className="p-2 rounded bg-green-800 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <TooltipProvider>
                        <UiTooltip>
                          <TooltipTrigger asChild>
                            <div className="relative group cursor-pointer">
                              <div className="flex flex-col gap-1">
                                <div 
                                  className={`w-3 h-3 rounded-full mr-2 ${
                                    token.status === 'green' ? 'bg-green-400' : 
                                    token.status === 'yellow' ? 'bg-yellow-400' : 
                                    token.status === 'red' ? 'bg-red-400' : 'bg-gray-400'
                                  }`}
                                />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-green-900 border border-green-500 p-3 rounded-lg shadow-lg z-50 min-w-[200px] max-w-[300px]">
                            <div className="text-sm text-green-100 whitespace-pre-wrap">
                              {token.audit_report || "No audit report available"}
                            </div>
                          </TooltipContent>
                        </UiTooltip>
                      </TooltipProvider>
                      <div>
                        <p className="font-bold">{token.symbol}</p>
                        <p className="text-sm text-green-300">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg">${token.usdValue?.toLocaleString() ?? '0'}</p>
                      <p className="text-sm text-green-300">Price: ${token.usdPrice?.toLocaleString() ?? '0'}</p>
                      <p className={`text-sm ${(token.price24hrPercentChange ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        24h Change: {(token.price24hrPercentChange ?? 0).toFixed(2)}%
                      </p>
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
