import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PortfolioActivityProps {
  chartData: Array<{ date: string; value: string }>;
}

export function PortfolioActivity({ chartData }: PortfolioActivityProps) {
  return (
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
  );
} 