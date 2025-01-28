import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  arbitrum,
  solana,
  base,
  solanaDevnet,
  solanaTestnet,
} from "@reown/appkit/networks";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [
  mainnet,
  arbitrum,
  base,
  solana,
  solanaDevnet,
  solanaTestnet,
] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter()],
});

export const adapters = [wagmiAdapter, solanaAdapter];

export const config = wagmiAdapter.wagmiConfig;
