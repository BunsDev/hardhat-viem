import {
  createPublicClient,
  createWalletClient,
  getContract,
  Hex,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();
import funJson from "../artifacts/contracts/Fun.sol/Fun.json";

const { abi, bytecode } = funJson;

const privateKey = process.env.PRIVATE_KEY;

const account = privateKeyToAccount(privateKey as Hex);

(async () => {
  const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL),
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL),
  });

  const hash = await client.deployContract({
    abi,
    bytecode,
    args: [134n],
  });

  const { contractAddress } = await publicClient.waitForTransactionReceipt({
    hash,
    retryDelay: 1,
  });

  if (contractAddress) {
    const contract = getContract({
      address: contractAddress,
      abi,
      client,
    });

    console.log("contract address is %s", contractAddress);

    console.log("X value is %s", await contract.read.x());
    const writehash = await contract.write.changeX([155n]);

    const writeReceipt = await publicClient.waitForTransactionReceipt({
      hash: writehash,
      retryDelay: 1,
    });
    if (writeReceipt) {
      console.log("New X value is %s", await contract.read.x());
    }

    //   const { contractAddress } = await publicClient.getTransactionReceipt({
    //     hash,
    //   });

    //   const receipt = await publicClient.waitForTransactionReceipt({
    //     hash,
    //     retryDelay: 3,
    //   });
    //   if (receipt.contractAddress) {
    //     const x = await publicClient.readContract({
    //       address: receipt.contractAddress,
    //       abi,
    //       functionName: "x",
    //     });
    //     console.log("X is %s", x);

    //     const writeX = await walletClient.writeContract({
    //       address: receipt.contractAddress,
    //       abi,
    //       functionName: "changeX",
    //       args: [150n],
    //     });

    //     const writeReceipt = await publicClient.waitForTransactionReceipt({
    //       hash: writeX,
    //       retryDelay: 3,
    //     });

    //     if (writeReceipt) {
    //       const newX = await publicClient.readContract({
    //         address: receipt.contractAddress,
    //         abi,
    //         functionName: "x",
    //       });
    //       console.log("New X is %s", newX);
    //     }
    // const x = await publicClient.getStorageAt({
    //   address: receipt.contractAddress,
    //   slot: toHex(0),
    // });
    // console.log("X is %s", x);
  }
})();
