import { LocalStorage, InformalMessenger } from "@reown/appkit-siwx";
import type { SIWXSession, SIWXMessage } from "@reown/appkit-core";
import { supabase } from "./supabase";

class SIWXLocalStorage extends LocalStorage {
  constructor(params: LocalStorage.ConstructorParams) {
    super(params);
  }

  private async verifySignature(
    walletAddress: string,
    signature: string,
    nonce: string,
    chainType: string
  ) {
    const response = await fetch("/api/verifySignature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, signature, nonce, chainType }),
    });

    return await response.json();
  }

  override async add(session: SIWXSession): Promise<void> {
    try {
      const {
        data: { accountAddress },
        signature,
        data: { nonce, chainId },
      } = session;
      const chainType = chainId.startsWith('solana:') ? 'solana' : 'ethereum';
      const verificationResult = await this.verifySignature(
        accountAddress,
        signature,
        nonce,
        chainType
      );

      if (verificationResult.error || !verificationResult.success) {
        throw new Error(
          verificationResult.message || "Signature verification failed"
        );
      }

      const { data: authSession, error: authError } =
        await supabase.auth.signInAnonymously();
      if (authError || !authSession) {
        throw new Error("Failed to create auth session");
      }

      await this.set([session]);
    } catch (error) {
      console.error("Error adding session:", error);
      throw error;
    }
  }
}

export default SIWXLocalStorage;

export class SIWXMessenger extends InformalMessenger {
  protected readonly version = "1";

  protected override stringify(params: SIWXMessage.Data): string {
    const message = `Sign this message to authenticate: ${params.nonce}`;
    return message;
  }
}
