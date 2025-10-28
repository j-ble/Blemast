# Setup - Token Airdropper UI

## Project Refactoring Plan

This document outlines the refactoring of the Blemast application into a **Static Site - Token Airdropper UI**.

## Overview

Transform the current Next.js application into a static site focused on token airdrop functionality for the Blemast (BLE) ERC20 token on Base chain.

## Architecture Goals

### Static Site Generation
- **Build-time rendering**: All pages pre-rendered as static HTML/CSS/JS
- **CDN-optimized**: Fast global delivery with minimal infrastructure
- **Client-side web3**: All blockchain interactions happen in the browser
- **No backend required**: Pure frontend + smart contract interaction

### Core Functionality
The Token Airdropper UI will enable:
1. **Airdrop Creation**: Owner can specify recipient addresses and amounts
2. **Batch Transfers**: Execute multiple token transfers in a single transaction
3. **Airdrop History**: View past airdrops (read from blockchain events)
4. **Recipient Portal**: Users can check eligibility and claim status

## Technical Stack

### Frontend (Static)
- **Next.js 15**: Using Static Export (`next export`)
- **OnchainKit**: Web3 wallet integration for Base chain
- **Wagmi/Viem**: Contract interaction and transaction management
- **React**: Component-based UI

### Smart Contracts
- **Blemast.sol**: Existing ERC20 token contract
- **AirdropManager.sol** (new): Optional dedicated airdrop contract with:
  - Batch transfer optimization
  - Merkle tree claims (gas-efficient for large airdrops)
  - Airdrop event logging

### Deployment
- **Static hosting**: Vercel, Netlify, or IPFS
- **Smart contracts**: Base Sepolia (testnet) → Base Mainnet

## Implementation Approach

### Phase 1: Static Site Configuration
```json
// next.config.ts modifications
export default {
  output: 'export', // Enable static export
  images: {
    unoptimized: true // Required for static export
  }
}
```

### Phase 2: Airdrop Features

#### Owner Features
- Connect wallet (must be contract owner)
- CSV upload for recipient list
- Batch size configuration (gas optimization)
- Execute airdrop transactions
- View transaction history

#### Public Features
- Check airdrop eligibility by address
- View claimable amounts
- Claim tokens (if using claim-based airdrop)
- Airdrop statistics and leaderboard

### Phase 3: Smart Contract Integration

#### Option A: Direct Transfer (Simple)
Use existing `Blemast.sol` contract:
- Owner calls `transfer()` multiple times
- No additional contract needed
- Higher gas costs for large airdrops

#### Option B: Batch Transfer Contract (Efficient)
Deploy new `AirdropManager.sol`:
```solidity
function batchTransfer(
    IERC20 token,
    address[] calldata recipients,
    uint256[] calldata amounts
) external onlyOwner
```

#### Option C: Merkle Airdrop (Most Efficient)
For very large airdrops:
- Off-chain merkle tree generation
- On-chain merkle root storage
- Users claim with merkle proof
- Lowest gas cost for owner

## Data Storage

### On-Chain
- Token balances (via Blemast contract)
- Airdrop events (contract logs)
- Merkle roots (if using Option C)

### Off-Chain (Static)
- Recipient lists (during creation)
- Merkle tree data (JSON files)
- UI state (local storage)

### Indexing
- Use Base RPC to read events
- Optional: Subgraph for historical data
- Cache in static JSON files at build time

## User Flows

### Owner: Create Airdrop
1. Connect wallet → verify ownership
2. Upload CSV (address, amount)
3. Review recipients & total amount
4. Approve BLE token spend (if needed)
5. Execute batch transfer
6. View transaction confirmation

### Recipient: Check Status
1. Enter wallet address (or connect)
2. View claimable amount
3. Claim tokens (if claim-based)
4. View transaction history

## File Structure

```
app/
├── page.tsx                    # Landing page
├── airdrop/
│   ├── create/page.tsx        # Owner airdrop creation
│   ├── history/page.tsx       # Past airdrops
│   └── claim/page.tsx         # Recipient claim portal
├── components/
│   ├── AirdropForm.tsx        # CSV upload & validation
│   ├── BatchTransfer.tsx      # Transaction execution
│   ├── RecipientTable.tsx     # Display recipients
│   └── ClaimWidget.tsx        # Claim interface
└── lib/
    ├── airdrop.ts             # Airdrop logic
    ├── merkle.ts              # Merkle tree generation
    └── contracts.ts           # Contract ABIs & addresses

contracts/src/
└── AirdropManager.sol         # Optional batch transfer contract
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_ONCHAINKIT_API_KEY=xxx
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BLEMAST_CONTRACT_ADDRESS=0x...

# Optional (if using dedicated airdrop contract)
AIRDROP_MANAGER_ADDRESS=0x...
```

## Testing Strategy

### Frontend
- Unit tests: Merkle tree generation
- Integration tests: Contract interaction
- E2E tests: Full airdrop flow

### Smart Contracts
- Foundry tests: 100% coverage target
- Gas optimization benchmarks
- Security audit considerations

## Deployment Checklist

- [ ] Configure Next.js for static export
- [ ] Deploy Blemast contract (already done)
- [ ] Deploy AirdropManager contract (if needed)
- [ ] Generate static build: `npm run build`
- [ ] Test static files locally
- [ ] Deploy to Vercel/Netlify
- [ ] Verify contract interactions work
- [ ] Test wallet connection on production
- [ ] Monitor gas costs and optimize

## Future Enhancements

- Multi-token support
- Scheduled airdrops
- Vesting schedules
- Token streaming
- NFT airdrops
- Social verification (Twitter/Discord)
- Sybil resistance mechanisms

## References

- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- OnchainKit Docs: https://onchainkit.xyz
- Base Chain Docs: https://docs.base.org
- Merkle Airdrop Pattern: https://github.com/Anish-Agnihotri/merkle-airdrop-starter
