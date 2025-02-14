import { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTokenHoldings } from "@/hooks/use-token-holdings";

export function DigitalAssets() {
  const { tokens, isLoading, error } = useTokenHoldings();
  const [expandedTokens, setExpandedTokens] = useState<{[key: string]: boolean}>({});

  if (isLoading) return <div className="animate-pulse text-green-300">Loading assets...</div>;
  if (error) return <div className="text-red-400">Error loading assets</div>;

  const toggleExpand = (symbol: string) => {
    setExpandedTokens((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  return (
    <Card className="bg-green-900/50 border border-green-500 mb-4 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-green-300 text-sm">
          {tokens.length} Token{tokens.length === 1 ? "" : "s"} Found
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="mt-2">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                token.status === "green"
                                  ? "bg-emerald-400"
                                  : token.status === "yellow"
                                  ? "bg-amber-400"
                                  : token.status === "red"
                                  ? "bg-red-400"
                                  : "bg-gray-400"
                              } shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-green-950/90 border border-green-400/30 p-4 rounded-lg shadow-xl backdrop-blur-sm z-50 max-w-md">
                          <div className="text-sm text-green-100 whitespace-pre-wrap leading-relaxed">
                            {token.audit_report || "No audit report available"}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-lg font-bold text-green-100">
                        {token.symbol}
                      </p>
                      <p className="text-sm text-green-400/80">{token.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-green-300/80">
                        Balance: {Number(token.balanceFormatted).toFixed(3)}
                      </p>
                    </div>
                  </div>
                </div>

                {token.codeseerAudit ? (
                  <div className="flex-1 min-w-[300px] border-l border-r border-green-400/20 px-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="col-span-2 mb-2">
                        <div className="flex items-center gap-1 text-green-400/70">
                          <Info size={14} />
                          <span className="text-xs">
                            More details can be found on CodeSeer
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-green-400/70">
                          Malicious Patterns
                        </p>
                        <p className="text-sm text-green-300">
                          {token.codeseerAudit.maliciousPatterns || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-400/70">
                          High Severity Issues
                        </p>
                        <p className="text-sm text-green-300">
                          {token.codeseerAudit.severity || "N/A"}
                        </p>
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
                            <p className="text-xs text-green-400/70">
                              Risk Assessment
                            </p>
                            <p className="text-sm text-green-300">
                              {token.codeseerAudit.riskAssessment ||
                                "No risk assessment available"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-green-400/70">
                              Code Commonality
                            </p>
                            <p className="text-sm text-green-300">
                              {token.codeseerAudit.commonality ||
                                "No commonality data available"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-[300px] border-l border-r border-green-400/20 px-4">
                    <p className="text-sm text-green-300">
                      No security report available
                    </p>
                  </div>
                )}

                {/* Right section - Price info */}
                <div className="text-right min-w-[150px]">
                  <p className="text-xl font-bold text-green-100">
                    ${token.usdValue?.toLocaleString() ?? "0"}
                  </p>
                  <p className="text-sm text-green-300/80 mt-1">
                    Price: ${token.usdPrice?.toLocaleString() ?? "0"}
                  </p>
                  {token.price24hrPercentChange !== undefined && (
                    <p
                      className={`text-sm font-medium mt-1 ${
                        token.price24hrPercentChange >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {token.price24hrPercentChange >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(token.price24hrPercentChange).toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
