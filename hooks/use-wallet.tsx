import { useCallback, useEffect } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useWalletInfo,
  useDisconnect
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
    open();
  }, [open]);

  const disconnectWallet = useCallback(async () => {
    clearTokenHoldings();
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    const saveWalletAddress = async () => {
      if (events.data.event === "CONNECT_SUCCESS") {
        try {
          const { error } = await supabase
            .from("smith_users")
            .insert({
              wallet_address: address,
              wallet_provider: walletInfo?.name,
            });
          if (error) {
            console.error("Error saving wallet address:", error.message);
          }
        } catch (err) {
          console.error("Error saving wallet address:", err);
        }
      }
    };

    saveWalletAddress();
  }, [events, address, walletInfo?.name]);

  return { connectWallet, disconnectWallet, isConnected, address, status };
};
