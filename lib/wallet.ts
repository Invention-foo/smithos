import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { supabase } from "./supabase";

export const disconnectWallet = async () => {
  const { disconnect } = useDisconnect();
  await disconnect();
  await supabase.auth.signOut();

  localStorage.removeItem("wagmi.wallet");
  localStorage.removeItem("wagmi.connected");
};

export const connectWallet = async () => {
  try {
    const { open } = useAppKit();
    if (!open) {
      console.error("AppKit open function is not available");
      return;
    }

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
};
