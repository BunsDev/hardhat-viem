import { createWalletClient, getContract, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, hardhat } from "viem/chains";
import dotenv from "dotenv";
dotenv.config();
import funJson from "../artifacts/contracts/Fun.sol/Fun.json";

const { abi } = funJson;

const privateKey = process.env.PRIVATE_KEY;

const account = privateKeyToAccount(privateKey as Hex);

const contractAddress = "0x7bfb253424f3517320e84fb77c9e42d665141dbe";

(async () => {
  const client = await createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL),
  });

  const contract = await getContract({
    address: contractAddress,
    abi,
    client,
  });

  await contract.watchEvent.XWasChanged({
    onLogs: (logs) => console.log(logs),
  });

  let x = 157n;
  setInterval(async () => {
    await contract.write.changeX([x]);
    x++;
  }, 5000);

  // console.log(events);
})();
