import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTransactions } from "@/hooks/use-transactions";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(var(--chart-1))",
  },
  received: {
    label: "Received",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function PortfolioActivity() {
  const { transactions, isLoading, error } = useTransactions();
  console.log(transactions);

  if (isLoading)
    return (
      <div className="animate-pulse text-green-300">Loading chart data...</div>
    );
  if (error) return null;

  const sortedData = transactions.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const groupedData = sortedData.reduce((acc, tx) => {
    const date = new Date(tx.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, sent: 0, received: 0 };
    }
    if (tx.type === "Sent") {
      acc[date].sent += Number(tx.value);
    } else if (tx.type === "Received") {
      acc[date].received += Number(tx.value);
    }
    return acc;
  }, {} as Record<string, { date: string; sent: number; received: number }>);

  const chartData = Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log(chartData);

  return (
    <Card className="bg-green-900/50 border border-green-500 mb-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Portfolio Activity</CardTitle>
        <TooltipProvider>
          <UiTooltip>
            <TooltipTrigger asChild>
              <Info
                size={16}
                className="text-green-400/70 hover:text-green-400 cursor-help"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-green-950/90 border border-green-400/30 p-3">
              <p className="text-green-300">
                Shows daily transaction volume and balance changes
              </p>
            </TooltipContent>
          </UiTooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="sent" fill="var(--color-sent)" radius={4} barSize={32} />
                <Bar
                  dataKey="received"
                  fill="var(--color-received)"
                  radius={4}
                  barSize={32}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
