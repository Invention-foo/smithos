import { NextResponse } from "next/server";
import { ethers } from "ethers";
// import nacl from "tweetnacl";
// import { decodeUTF8 } from "tweetnacl-util";
// import bs58 from "bs58";

export async function POST(request: Request) {
  try {
    const { walletAddress, signature, nonce } = await request.json();

    if (!walletAddress || !signature || !nonce) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const message = `Sign this message to authenticate: ${nonce}`;
    let isValid = false;

    const recoveredAddress = ethers.verifyMessage(message, signature);
    isValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    // else if (chainType === "solana") {
    //   try {
    //     const messageBytes = decodeUTF8(message);
    //     // Solana signatures and public keys are typically received in base58 format
    //     const signatureBytes = Buffer.from(bs58.decode(signature));
    //     const publicKeyBytes = Buffer.from(bs58.decode(walletAddress));

    //     isValid = nacl.sign.detached.verify(
    //       messageBytes,
    //       signatureBytes,
    //       publicKeyBytes
    //     );
    //   } catch (err) {
    //     console.error('Solana signature verification error:', err);
    //     isValid = false;
    //   }
    // }

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signature verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
