import { useCallback, useEffect } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useWalletInfo,
  useDisconnect,
} from "@reown/appkit/react";
import { supabase } from "@/lib/supabase";
import { useTokenHoldings } from "./use-token-holdings";

export const useWallet = () => {
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const { disconnect } = useDisconnect();
  const { clearTokenHoldings } = useTokenHoldings();
  const events = useAppKitEvents();

  const connectWallet = useCallback(async () => {
    try {
      if (!open) {
        console.error("AppKit open function is not available");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      await open();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Wallet connection error:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
    }
  }, [open, status, isConnected, walletInfo]);

  const disconnectWallet = useCallback(async () => {
    try {
      clearTokenHoldings();
      await disconnect();
      localStorage.removeItem("wagmi.wallet");
      localStorage.removeItem("wagmi.connected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  }, [disconnect, clearTokenHoldings, status, isConnected]);

  useEffect(() => {
    const upsertWalletAddress = async () => {
      if (!address || !walletInfo?.name) return;

      try {
        const { error } = await supabase
          .from("smith_users")
          .upsert(
            {
              wallet_address: address,
              wallet_provider: walletInfo.name,
            },
            {
              onConflict: 'wallet_address'
            }
          );

        if (error) {
          console.error("Error upserting wallet address:", error.message);
        }
      } catch (err) {
        console.error("Error upserting wallet address:", err);
      }
    };

    upsertWalletAddress();
  }, [address, walletInfo?.name]);

  return { connectWallet, disconnectWallet, isConnected, address, status };
};
