# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a hybrid Next.js + Foundry project that combines a web3 frontend with Solidity smart contracts. The project is built with:
- **Frontend**: Next.js 15 with OnchainKit for web3 integration on Base chain
- **Smart Contracts**: Foundry/Forge for Solidity development and testing
- **Token**: Blemast (BLE) - an ERC20 token with burn, pause, permit (EIP-2612), role-based access control, max supply cap (1B), and rate limiting

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

**Security Note**: This uses `--account deployer` which leverages Foundry's encrypted keystore instead of exposing private keys in environment variables. This is more secure than `--private-key` as keys are never stored in plaintext.

For script-based deployment with verification:
```bash
forge script contracts/script/Blemast.s.sol:BlemastScript \
  --rpc-url base_sepolia \
  --account deployer \
  --broadcast \
  --verify
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
  - RPC endpoints: `base_sepolia`, `base_mainnet`
  - Etherscan verification configured for BaseScan
- **next.config.ts**: Webpack externals configured for web3 libraries (pino-pretty, lokijs, encoding)
- **.env**: Contains environment variables:
  - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: OnchainKit API key for frontend
  - `BASE_SEPOLIA_RPC_URL`: RPC endpoint for Base Sepolia testnet
  - `BASE_MAINNET_RPC_URL`: RPC endpoint for Base Mainnet
  - `BASESCAN_API_KEY`: API key for contract verification on BaseScan
  - `BLEMAST_SEPOLIA_ADDRESS`: Deployed Blemast contract address on testnet
  - `BLEMAST_MAINNET_ADDRESS`: Deployed Blemast contract address on mainnet
  - `PRIVATE_KEY`: (Optional) Private key for deployment - prefer using `--account deployer` instead

### Frontend Architecture
- **app/rootProvider.tsx**: Wraps app with OnchainKitProvider configured for Base chain
- **OnchainKit Integration**: Configured with auto appearance mode and modal wallet display
- **Chain**: Defaults to Base mainnet (configurable via OnchainKitProvider)

### Smart Contract Architecture
- **Blemast.sol**: Main ERC20 token contract (contracts/src/Blemast.sol:21)
  - **Base Extensions**: ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, AccessControl
  - **Token Details**:
    - Name: "Blemast"
    - Symbol: "BLE"
    - Decimals: 18
    - Max Supply: 1,000,000,000 BLE (1 billion tokens)
    - Initial Supply: 100,000,000 BLE (100 million, 10% of max)
  - **Access Control**: Role-based permissions (not Ownable)
    - `DEFAULT_ADMIN_ROLE`: Can grant/revoke all roles
    - `MINTER_ROLE`: Can mint new tokens (subject to rate limiting)
    - `PAUSER_ROLE`: Can pause/unpause all token transfers
  - **Rate Limiting**: Mint operations limited to 100,000 BLE per 24-hour period
  - **Security Features**:
    - Custom errors for gas optimization
    - Max supply enforcement
    - Zero address validation
    - EIP-2612 permit for gasless approvals
  - **Helper Functions**:
    - `availableMintAmount()`: Returns mintable amount in current period
    - `timeUntilNextPeriod()`: Returns seconds until rate limit resets
  - **Solidity Version**: 0.8.20
  - **Test Coverage**: 97.83% line coverage (45/46 lines), 100% function coverage

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
