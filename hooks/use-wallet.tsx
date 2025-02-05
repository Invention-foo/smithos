import { useAppKitAccount } from "@reown/appkit/react";

export const useWallet = () => {
  const { address, isConnected, status } = useAppKitAccount();

  return { isConnected, address, status };
};
