import "dotenv/config";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { readFileSync } from "node:fs";
import path from "node:path";

const rpcUrl = process.env.BASE_RPC_URL;
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

if (!rpcUrl || !privateKey) {
  throw new Error("Set BASE_RPC_URL and DEPLOYER_PRIVATE_KEY in .env");
}

const account = privateKeyToAccount(privateKey as `0x${string}`);
const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) });
const walletClient = createWalletClient({ chain: base, transport: http(rpcUrl), account });

const abi = JSON.parse(
  readFileSync(path.join("artifacts", "Scoreboard.abi.json"), "utf-8")
);
const bytecode = readFileSync(path.join("artifacts", "Scoreboard.bin"), "utf-8");

async function main() {
  const hash = await walletClient.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: []
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Deployed:", receipt.contractAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
