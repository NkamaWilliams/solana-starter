import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { PublicKey } from "@solana/web3.js";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";

// Define our Mint address
const mint = new PublicKey("BGNqgQkRjr2DNhfBjKMfLB7CkoE8o4um48a6cZqmyvxs");

//Create metadata PDA
const program_id = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const seeds = [Buffer.from("metadata"), program_id.toBuffer(), mint.toBuffer()];
const [metadata_pda, bump] = PublicKey.findProgramAddressSync(
  seeds,
  program_id
);

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      metadata: fromWeb3JsPublicKey(metadata_pda),
      mint: fromWeb3JsPublicKey(mint),
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "WalkerWBA",
      symbol: "WWBA",
      uri: "",
      sellerFeeBasisPoints: 20,
      creators: [
        {
          address: keypair.publicKey,
          verified: true,
          share: 100,
        },
      ],
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx
      .sendAndConfirm(umi)
      .then((r) => r.signature.toString());
    console.log(result);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

//Metadata: 42,44,95,97,88,140,61,211,97,253,7,213,80,93,200,166,215,66,34,165,101,148,84,161,102,120,62,215,196,78,44,9,187,39,14,123,147,228,48,199,110,51,65,149,186,186,15,92,200,72,36,157,240,85,114,106,81,235,76,189,223,122,42,2
