import { Token } from "@/hooks/use-token-holdings";
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TokenCard = ({ token }: { token: Token }) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "green":
        return "w-1 h-1 rounded-full bg-green-400";
      case "yellow":
        return "w-1 h-1 rounded-full bg-yellow-400";
      case "red":
        return "w-1 h-1 rounded-full bg-red-400";
      default:
        return "w-1 h-1 rounded-full bg-gray-400";
    }
  };
  const color = getStatusColor(token.status);

  return (
    <Card className="p-4 bg-green-800/60 hover:bg-opacity-80 transition-colors duration-200 border-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {token.status && (
            <div className="mr-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="relative group"
                    aria-label="View security audit"
                  >
                    <div className="flex flex-col gap-1">
                      <div className={color}></div>
                      <div className={color}></div>
                      <div className={color}></div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-green-900 border border-green-500 p-3 rounded-lg shadow-lg z-50 min-w-[200px] max-w-[300px]">
                  <div className="text-sm text-green-100 whitespace-pre-wrap">
                    {token.audit_report || "No audit report available"}
                  </div>
                </PopoverContent>
              </Popover>
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
          <p className="text-lg font-medium text-green-300">
            {Number(token.balanceFormatted).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TokenCard;
