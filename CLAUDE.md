# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hybrid Next.js + Foundry project that combines a web3 frontend with Solidity smart contracts. The project is built with:
- **Frontend**: Next.js 15 with OnchainKit for web3 integration on Base chain
- **Smart Contracts**: Foundry/Forge for Solidity development and testing
- **Token**: Blemast (BLE) - an ERC20 token with burn, pause, and ownable features

## Development Commands

### Frontend (Next.js)
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Smart Contracts (Foundry)
```bash
forge build          # Compile contracts
forge test           # Run all tests
forge fmt            # Format Solidity code
forge snapshot       # Gas usage snapshots
forge coverage --report lcov && genhtml lcov.info --branch-coverage --output-dir coverage
                     # Generate test coverage report with HTML output
```

### Deployment
Deploy the Blemast contract to Base Sepolia:
```bash
forge create contracts/src/Blemast.sol:Blemast \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer \
  --broadcast \
  --constructor-args <public_wallet_address>
```

### Blockchain Interaction (Cast)
```bash
cast call $COUNTER_CONTRACT_ADDRESS "number()(uint256)" --rpc-url $BASE_SEPOLIA_RPC_URL
```

## Project Structure

### Key Directories
- **app/**: Next.js app directory with frontend pages and components
- **contracts/src/**: Solidity smart contracts
- **contracts/test/**: Foundry test files
- **contracts/lib/**: Foundry dependencies (forge-std, openzeppelin-contracts)

### Configuration Files
- **foundry.toml**: Foundry configuration with custom paths and remappings
  - Contracts: `contracts/src/`
  - Tests: `contracts/test/`
  - Output: `contracts/out/`
  - OpenZeppelin imports: `@openzeppelin/contracts/`
- **next.config.ts**: Webpack externals configured for web3 libraries (pino-pretty, lokijs, encoding)
- **.env**: Contains environment variables:
  - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: OnchainKit API key
  - `BASE_SEPOLIA_RPC_URL`: RPC endpoint for Base Sepolia testnet
  - `COUNTER_CONTRACT_ADDRESS`: Deployed contract address

### Frontend Architecture
- **app/rootProvider.tsx**: Wraps app with OnchainKitProvider configured for Base chain
- **OnchainKit Integration**: Configured with auto appearance mode and modal wallet display
- **Chain**: Defaults to Base mainnet (configurable via OnchainKitProvider)

### Smart Contract Architecture
- **Blemast.sol**: Main ERC20 token contract
  - Extends OpenZeppelin's ERC20, ERC20Burnable, ERC20Pausable, Ownable
  - Owner-controlled minting and pausing
  - Token: "Blemast" (BLE)
  - Uses Solidity 0.8.20

## Testing

The project targets 100% test coverage for smart contracts. When writing tests:
- Use Foundry's test framework (forge-std/Test.sol)
- Generate coverage reports using the coverage command above
- Coverage reports output to `lcov.info` and HTML files in `coverage/` directory

## Important Notes

- All Foundry paths are prefixed with `contracts/` (e.g., `contracts/src/`, `contracts/test/`)
- The Next.js webpack config excludes specific web3 dependencies to prevent build issues
- When deploying contracts, the constructor requires an initial owner address
- The project uses npm for frontend dependencies and Foundry for contract dependencies
