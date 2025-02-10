import { LocalStorage, InformalMessenger } from "@reown/appkit-siwx";
import type { SIWXSession, SIWXMessage } from "@reown/appkit-core";
import { walletService } from "../services/wallet.service";

class SIWXLocalStorage extends LocalStorage {
  constructor(params: LocalStorage.ConstructorParams) {
    super(params);
  }

  override async add(session: SIWXSession): Promise<void> {
    try {
      await walletService.verifyAndStoreSession(session);
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
