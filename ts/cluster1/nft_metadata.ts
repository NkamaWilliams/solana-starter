import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");
umi.use(irysUploader());

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://arweave.net/800cxQKvBjw2vAB4ZXJvYL5GRgGcG3tzGSRWdRRZJk8?ext=png";
    const metadata = {
      name: "Walker Rug",
      symbol: "WRug",
      description: "A refreshing desert rug",
      image,
      attributes: [{ trait_type: "Rarity", value: "2x" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson([metadata]);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
//Metadata URI: https://arweave.net/G_lxPXqV-Ad6EiRFN4XEk-bILOE2kpH805RWVPoU-7A
