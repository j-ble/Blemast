# Build an Onchain Tally App on Base

> A complete guide to building your first onchain app using Next.js, OnchainKit, and Foundry on Base

## Overview

This tutorial walks you through building a simple onchain tally app that demonstrates how to:
- Set up a Next.js project with OnchainKit
- Deploy a smart contract to Base Sepolia testnet using Foundry
- Integrate blockchain interactions into your frontend

## Prerequisites

- Node.js and npm installed
- Basic knowledge of React/Next.js
- Basic understanding of Solidity
- A CDP API Key from [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
- Base Sepolia testnet ETH for deployment

## Step 1: Bootstrap Your OnchainKit Project

Create a new OnchainKit project:

```bash
npm create onchain@latest
```

Follow the prompts to set up your project, then navigate to it and start the development server:

```bash
cd my-onchainkit-app
npm install
npm run dev
```

Your app should now be running at `http://localhost:3000`.

## Step 2: Set Up Foundry for Smart Contracts

Install Foundry (if not already installed):

```bash
mkdir contracts && cd contracts
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Initialize a Foundry project:

```bash
forge init --no-git
```

## Step 3: Configure Your Environment

Create a `.env` file in the `contracts` directory:

```bash
BASE_RPC_URL="https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
```

## Step 4: Secure Your Private Key

Use Foundry's secure keystore to import your deployer wallet:

```bash
cast wallet import deployer --interactive
```

This will prompt you to enter your private key securely. Make sure this wallet has Base Sepolia ETH for deployment.

**Get testnet ETH**: Visit a Base Sepolia faucet to fund your wallet.

## Step 5: Create Your Smart Contract

The default Foundry setup includes a `Counter.sol` contract. Here's what it looks like:

```solidity
// contracts/src/Counter.sol
pragma solidity ^0.8.13;

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
```

For this tutorial, you can use this contract as-is or simplify it to:

```solidity
// contracts/src/Counter.sol
pragma solidity ^0.8.0;

contract Counter {
    uint256 public number;

    function increment() public {
        number++;
    }
}
```

## Step 6: Deploy Your Contract

Build your contract:

```bash
forge build
```

Deploy to Base Sepolia:

```bash
forge create ./src/Counter.sol:Counter \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer
```

Save the deployed contract address from the output - you'll need it for frontend integration.

## Step 7: Verify Your Deployment

Check your contract's current number:

```bash
cast call $YOUR_CONTRACT_ADDRESS "number()(uint256)" --rpc-url $BASE_SEPOLIA_RPC_URL
```

## Interacting with Blemast ERC20 Token

If you deployed the Blemast token contract instead of Counter, use these commands to interact with it:

### Read-Only Functions (No Gas Cost)

**Get Token Name:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "name()(string)" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Get Token Symbol:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "symbol()(string)" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Get Decimals:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "decimals()(uint8)" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Get Total Supply:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "totalSupply()(uint256)" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Get Balance of an Address:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "balanceOf(address)(uint256)" <ADDRESS> --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Get Contract Owner:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "owner()(address)" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Check if Contract is Paused:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "paused()(bool)" --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Get Nonces (for Permit functionality):**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "nonces(address)(uint256)" <ADDRESS> --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

**Check Allowance:**
```bash
source .env && cast call "$COUNTER_CONTRACT_ADDRESS" "allowance(address,address)(uint256)" <OWNER_ADDRESS> <SPENDER_ADDRESS> --rpc-url "$BASE_SEPOLIA_RPC_URL"
```

### Write Functions (Require Transactions - Cost Gas)

**Transfer Tokens:**
```bash
source .env && cast send "$COUNTER_CONTRACT_ADDRESS" "transfer(address,uint256)" <TO_ADDRESS> <AMOUNT> --rpc-url "$BASE_SEPOLIA_RPC_URL" --account deployer
```

**Approve Spender:**
```bash
source .env && cast send "$COUNTER_CONTRACT_ADDRESS" "approve(address,uint256)" <SPENDER_ADDRESS> <AMOUNT> --rpc-url "$BASE_SEPOLIA_RPC_URL" --account deployer
```

**Mint Tokens (Owner Only):**
```bash
source .env && cast send "$COUNTER_CONTRACT_ADDRESS" "mint(address,uint256)" <TO_ADDRESS> <AMOUNT> --rpc-url "$BASE_SEPOLIA_RPC_URL" --account deployer
```

**Burn Tokens:**
```bash
source .env && cast send "$COUNTER_CONTRACT_ADDRESS" "burn(uint256)" <AMOUNT> --rpc-url "$BASE_SEPOLIA_RPC_URL" --account deployer
```

**Pause Contract (Owner Only):**
```bash
source .env && cast send "$COUNTER_CONTRACT_ADDRESS" "pause()" --rpc-url "$BASE_SEPOLIA_RPC_URL" --account deployer
```

**Unpause Contract (Owner Only):**
```bash
source .env && cast send "$COUNTER_CONTRACT_ADDRESS" "unpause()" --rpc-url "$BASE_SEPOLIA_RPC_URL" --account deployer
```

## Step 8: Integrate with Your Frontend

Create a `calls.ts` file to define your contract interactions:

```typescript
// app/calls.ts
const counterContractAddress = '0x...'; // Your deployed contract address

const counterContractAbi = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export const calls = [
  {
    address: counterContractAddress,
    abi: counterContractAbi,
    functionName: 'increment',
    args: [],
  },
];
```

Update your main page to include the Transaction component:

```typescript
// app/page.tsx
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { calls } from './calls';

export default function Home() {
  return (
    <div>
      <h1>Onchain Tally App</h1>
      <Transaction
        calls={calls}
        chainId={84532} // Base Sepolia
      >
        <TransactionButton text="Increment Counter" />
      </Transaction>
    </div>
  );
}
```

## Step 9: Test Your App

1. Make sure your Next.js app is running (`npm run dev`)
2. Connect your wallet (the same one you used for deployment works great)
3. Switch to Base Sepolia network in your wallet
4. Click "Increment Counter"
5. Confirm the transaction in your wallet
6. Verify the transaction on [BaseScan Sepolia](https://sepolia.basescan.org/)

## What You Built

Congratulations! You've built an onchain app that:
- ✅ Deploys a smart contract to Base Sepolia
- ✅ Integrates OnchainKit for seamless wallet interactions
- ✅ Creates blockchain transactions from a Next.js frontend
- ✅ Provides a smooth user experience for onchain interactions

## Next Steps

Now that you have a working onchain app, consider:
- Adding gasless transactions using [paymasters](https://docs.base.org/guides/gasless-transaction)
- Implementing onchain identity features with [Basename](https://docs.base.org/base-learn/docs/name-service)
- Building more complex smart contracts with additional functionality
- Deploying to Base mainnet when you're ready for production

## Resources

- [Base Documentation](https://docs.base.org/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Base Developer Portal](https://portal.cdp.coinbase.com/)

---

**Built with Base** - A fast, low-cost, builder-friendly Ethereum L2 built to bring the next billion users onchain.
