import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { supabase } from "./supabase";

export const disconnectWallet = async () => {
  const { disconnect } = useDisconnect();
  await disconnect();
  await supabase.auth.signOut();

  localStorage.removeItem("wagmi.wallet");
  localStorage.removeItem("wagmi.connected");
  // TODO: clear transactions and tokens
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

export const getBlockExplorerUrl = (hash: string, caipNetworkId: string | undefined) => {
  if (!caipNetworkId) return '';
  const chainId = caipNetworkId.split(':')[1];
  const blockchain = getBlockchainFromChainId(chainId);
  const baseUrl = blockchain === 'base'
    ? 'https://basescan.org'
    : 'https://etherscan.io';

  return `${baseUrl}/tx/${hash}`;
}

export const getBlockchainFromChainId = (chainId: string): string => {
  switch (chainId) {
    case '8453':
      return 'base';
    default:
      return 'ethereum';
  }
}