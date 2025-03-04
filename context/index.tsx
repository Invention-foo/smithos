"use client";

import { wagmiAdapter, projectId, networks } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import {
  DefaultSIWX,
  EIP155Verifier,
  // SolanaVerifier,
} from "@reown/appkit-siwx";
import SIWXLocalStorage, { SIWXMessenger } from "@/lib/siwx";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "smithos",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

const storage = new SIWXLocalStorage({ key: "@appkit/siwx" });

const siwx = new DefaultSIWX({
  messenger: new SIWXMessenger({
    domain: "reown.com", // change this in production
    uri: "https://reown.com", // change this in production
    getNonce: async () =>
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  }),
  verifiers: [
    new EIP155Verifier(),
    // new SolanaVerifier(),
  ],
  storage: storage,
});

createAppKit({
  adapters: [
    wagmiAdapter,
    // solanaAdapter,
  ],
  projectId,
  networks,
  metadata: metadata,
  siwx: siwx,
  features: {
    analytics: true,
  },
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
