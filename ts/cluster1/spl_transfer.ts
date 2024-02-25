import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("BGNqgQkRjr2DNhfBjKMfLB7CkoE8o4um48a6cZqmyvxs");

// Recipient address
const to = new PublicKey("FAXDZafhXmNBykiqSQtDmT3ZELDiRifzPtq9Yv4zEuvM");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const tokenFrom = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      false
    );
    // Get the token account of the toWallet address, and if it does not exist, create it
    const tokenTo = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
      false
    );
    // Transfer the new token to the "toTokenAccount" we just created
    const result = await transfer(
      connection,
      keypair,
      tokenFrom.address,
      tokenTo.address,
      keypair,
      6n * 1_000_000n
    );
    console.log(`Final tx: ${result}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
//4hpszxrAvSkSsCZZHsK4Z4USvvVN1CzsMZqvKnG46rmRrSDEEuWsDCE2X5y2H4snRiEDzu5fD1qYmhRGGmMbYpQz
