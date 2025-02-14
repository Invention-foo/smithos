import { useTokenHoldings } from "@/hooks/use-token-holdings";

export function PortfolioValue() {
  const { tokens, isLoading, error } = useTokenHoldings();
  const totalValue = tokens.reduce((sum, token) => sum + (token.usdValue || 0), 0);

  if (isLoading) return <div className="animate-pulse text-green-300">Loading...</div>;
  if (error) return null;

  return (
    <p className="text-green-300 mt-2">
      Portfolio Value: ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}
    </p>
  );
} 