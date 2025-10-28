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

## Visual Development

### Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

## Important Notes

- All Foundry paths are prefixed with `contracts/` (e.g., `contracts/src/`, `contracts/test/`)
- The Next.js webpack config excludes specific web3 dependencies to prevent build issues
- When deploying contracts, the constructor requires an initial owner address
- The project uses npm for frontend dependencies and Foundry for contract dependencies
