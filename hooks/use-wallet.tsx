import { useEffect } from "react";
import { useAppKitAccount, useWalletInfo } from "@reown/appkit/react";
import { supabase } from "@/lib/supabase";

export const useWallet = () => {
  const { address, isConnected, status } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();

  useEffect(() => {
    const upsertWalletAddress = async () => {
      if (!address || !walletInfo?.name) return;

      try {
        const { error } = await supabase.from("smith_users").upsert(
          {
            wallet_address: address,
            wallet_provider: walletInfo.name,
          },
          {
            onConflict: "wallet_address",
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

  return { isConnected, address, status };
};
