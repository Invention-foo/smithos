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
    // console.log('Attempting to connect wallet...');
    // console.log('Current connection status:', status);
    // console.log('Is connected:', isConnected);
    // console.log('AppKit open function:', open);
    // console.log('WalletInfo:', walletInfo);
    
    try {
      if (!open) {
        console.error('AppKit open function is not available');
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await open();
      // console.log('Wallet open called successfully');
      
      // setTimeout(() => {
      //   console.log('Checking if modal is visible in DOM...');
      //   const modalElement = document.querySelector('[role="dialog"]');
      //   console.log('Modal element found:', !!modalElement);
      // }, 500);
      
    } catch (error) {
      console.error('Error opening wallet:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  }, [open, status, isConnected, walletInfo]);

  const disconnectWallet = useCallback(async () => {
    // console.log('Attempting to disconnect wallet...');
    // console.log('Current connection status:', status);
    // console.log('Is connected:', isConnected);
    
    try {
      clearTokenHoldings();
      await disconnect();
      // console.log('Wallet disconnected successfully');
      
      // Clear local storage
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('wagmi.connected');
      // console.log('Local storage cleared');
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [disconnect, clearTokenHoldings, status, isConnected]);

  // Log wallet events
  // useEffect(() => {
  //   console.log('Wallet event received:', events.data);
  //   if (events.data.event) {
  //     console.log('Event type:', events.data.event);
  //   }
  // }, [events]);

  // Log connection status changes
  // useEffect(() => {
  //   console.log('Connection status changed:', {
  //     status,
  //     isConnected,
  //     address,
  //     walletInfo: walletInfo?.name
  //   });
  // }, [status, isConnected, address, walletInfo]);

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
