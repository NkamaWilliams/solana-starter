import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image
    const image = await readFile(
      "/home/izomana/solana/NkamaWilliams_Sol_1Q24/solana-starter/ts/desert.png"
    );
    const rug = createGenericFile(image, "desert.png", {
      contentType: "image/png",
    });
    const [myUri] = await umi.uploader.upload([rug]);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();

//Image URI: https://arweave.net/800cxQKvBjw2vAB4ZXJvYL5GRgGcG3tzGSRWdRRZJk8?ext=png
