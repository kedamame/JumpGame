// ===========================================
// Contract Deployment Script for Base Mainnet
// ===========================================
//
// Usage:
//   1. Set DEPLOYER_PRIVATE_KEY in .env
//   2. Ensure deployer has ETH on Base mainnet
//   3. Run: npm run deploy:contract
//
// This script uses viem directly (no Hardhat/Foundry required)
// ===========================================

import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Scoreboard contract bytecode (compiled from Solidity)
// Note: In production, use Hardhat/Foundry to compile. This is pre-compiled.
const SCOREBOARD_BYTECODE = `0x608060405234801561001057600080fd5b50610550806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063313ce5671461005c5780635a9b0b8914610079578063669f6186146100b2578063aa90e1a2146100ca578063f9f8bdb7146100df575b600080fd5b61006660001981565b6040519081526020015b60405180910390f35b61009c610087366004610462565b60006020819052908152604090208054600182015460028301546003840154600490940154929493919290919085565b604051610070959493929190610483565b6100666305f5e10081565b6100dd6100d83660046104af565b6100f4565b005b6100666127108155565b6100666305f5e10081111561014f5760405162461bcd60e51b815260206004820152601560248201527f53636f726520657863656564206d6178696d756d000000000000000000000000604482015260640160405180910390fd5b620186a0831115610198576040805162461bcd60e51b815260206004820152601560248201527f466c6f6f7220657863656564206d6178696d756d0000000000000000000000006044820152606401fd5b6127108211156101ea5760405162461bcd60e51b815260206004820152601560248201527f436f6d626f20657863656564206d6178696d756d00000000000000000000000060448201526064015b60405180910390fd5b336000908152602081905260409020548411156103f6576040518060a001604052808581526020018481526020018381526020018281526020014281525060008033600160a01b6001600160a01b03166001600160a01b0316815260200190815260200160002060008201518160000155602082015181600101556040820151816002015560608201518160030155608082015181600401559050507f8d2f8e4c5e7d95e5d7a4e5d9d5e5d9d5e5d9d5e5d9d5e5d9d5e5d9d5e5d9d5e33858585854260405161036797969594939291906001600160a01b039788168152602081019690965260408601949094526060850192909252608084015260a083015260c082015260e00190565b60405180910390a15b50505050565b80356001600160a01b038116811461038d57600080fd5b919050565b6000602082840312156103a457600080fd5b6103ad82610376565b9392505050565b600080600080608085870312156103ca57600080fd5b5050823594602084013594506040840135936060013592509050565b600060208083528351808285015260005b81811015610413578581018301518582016040015282016103f7565b506000604082860101526040601f19601f8301168501019250505092915050565b6000806000806080858703121561044a57600080fd5b843593506020850135925060408501359150606085013590565b60006020828403121561047657600080fd5b5035919050565b85815284602082015283604082015282606082015281608082015260a08101949350505050565b600080600080608085870312156104ba57600080fd5b843593506020850135925060408501359150606085013590509295919450925056fea2646970667358221220abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd123464736f6c63430008140033`;

// Actual ABI for deployment verification
const SCOREBOARD_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'MAX_SCORE',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

async function main() {
  console.log('===========================================');
  console.log('Tower Jump - Scoreboard Contract Deployment');
  console.log('Chain: Base Mainnet (8453)');
  console.log('===========================================\n');

  // Load private key from environment
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error('Error: DEPLOYER_PRIVATE_KEY not set in environment');
    console.error('Please add it to your .env file');
    process.exit(1);
  }

  // Create account from private key
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log(`Deployer address: ${account.address}`);

  // Create clients
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

  const publicClient = createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(rpcUrl),
  });

  // Check deployer balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Deployer balance: ${Number(balance) / 1e18} ETH`);

  if (balance < parseEther('0.001')) {
    console.error('\nError: Insufficient balance for deployment');
    console.error('Please fund the deployer address with at least 0.001 ETH on Base mainnet');
    process.exit(1);
  }

  // Estimate gas for deployment
  console.log('\nEstimating gas...');

  try {
    // Deploy contract
    console.log('Deploying Scoreboard contract...');

    const hash = await walletClient.deployContract({
      abi: SCOREBOARD_ABI,
      bytecode: SCOREBOARD_BYTECODE as `0x${string}`,
    });

    console.log(`Transaction hash: ${hash}`);
    console.log('Waiting for confirmation...');

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log('\n===========================================');
    console.log('Deployment successful!');
    console.log('===========================================');
    console.log(`Contract address: ${receipt.contractAddress}`);
    console.log(`Transaction: https://basescan.org/tx/${hash}`);
    console.log(`Contract: https://basescan.org/address/${receipt.contractAddress}`);
    console.log('\nNext steps:');
    console.log('1. Copy the contract address above');
    console.log('2. Add to .env: NEXT_PUBLIC_SCOREBOARD_ADDRESS=<address>');
    console.log('3. Verify on BaseScan (optional but recommended)');

  } catch (error) {
    console.error('\nDeployment failed:', error);
    process.exit(1);
  }
}

// Note: For actual deployment, compile the contract with Hardhat or Foundry
// and use the generated bytecode. The bytecode above is a placeholder.
//
// To compile with Foundry:
//   forge build
//   cat out/Scoreboard.sol/Scoreboard.json | jq -r '.bytecode.object'
//
// To compile with Hardhat:
//   npx hardhat compile
//   Then extract bytecode from artifacts/contracts/Scoreboard.sol/Scoreboard.json

console.log(`
===========================================
IMPORTANT: Contract Compilation Required
===========================================

The bytecode in this script is a PLACEHOLDER.
Before deploying, you must:

1. Install Foundry: https://book.getfoundry.sh/getting-started/installation

2. Initialize Foundry in this project:
   forge init --no-commit

3. Compile the contract:
   forge build

4. Get the actual bytecode:
   cat out/Scoreboard.sol/Scoreboard.json | jq -r '.bytecode.object'

5. Replace SCOREBOARD_BYTECODE in this file with the actual bytecode

6. Run deployment:
   npm run deploy:contract

Alternative: Use Hardhat or Remix IDE to deploy directly.
`);

// Uncomment to run actual deployment after adding correct bytecode:
// main().catch(console.error);
