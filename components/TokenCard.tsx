import { Token } from "@/hooks/use-token-holdings";
import React from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";

const TokenCard = ({ token }: { token: Token }) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "green":
        return "bg-green-400";
      case "yellow":
        return "bg-yellow-400";
      case "red":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg bg-green-800/60 
          flex justify-between items-center hover:bg-opacity-80 transition-colors duration-200 hover:shadow-lg`}
    >
      <div className="flex items-center">
        {token.status && (
          <div className="mr-3 flex items-center">
            <HoverCard>
              <HoverCardTrigger>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    token.status
                  )} cursor-pointer`}
                ></div>
              </HoverCardTrigger>
              <HoverCardContent className="bg-green-900 border border-green-500 p-3 rounded-lg shadow-lg whitespace-pre-wrap max-w-xs">
                <p className="text-sm text-green-100">
                  {token.audit_report || "No audit report available"}
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
        <div>
          <p className="font-bold text-green-100">{token.symbol}</p>
          <p className="text-sm text-green-300/90">{token.name}</p>
          {token.usdPrice && (
            <p className="text-xs text-green-400/90 mt-0.5">
              $
              {token.usdPrice < 0.001
                ? token.usdPrice.toExponential(3)
                : token.usdPrice.toFixed(3)}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {token.usdValue && (
          <p className="text-sm text-green-300/90">
            ${token.usdValue.toFixed(2)}
          </p>
        )}
        <p className="text-lg font-medium">
          {Number(token.balanceFormatted).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default TokenCard;
