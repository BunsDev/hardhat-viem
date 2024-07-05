import {
  createPublicClient,
  formatEther,
  Hex,
  http,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

const account = privateKeyToAccount(privateKey as Hex);

console.log(account.address);

(async () => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL),
  }).extend(publicActions);

  const balance = await publicClient.getBalance({
    address: account.address,
  });
  console.log("balance in eth is %s", formatEther(balance));

  const nonce = await publicClient.getTransactionCount({
    address: account.address,
  });

  console.log("nonce is %d", nonce);
})();
