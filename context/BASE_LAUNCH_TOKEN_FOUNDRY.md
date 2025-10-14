# Launch a Token on Base - Technical Implementation with Foundry

Source: https://docs.base.org/get-started/launch-token#technical-implementation-with-foundry

## Overview

Launching a token on Base can be accomplished through multiple approaches, from no-code platforms to custom smart contract development. This guide focuses on custom development using Foundry for maximum control.

## Choosing Your Launch Approach

### Platform-Based Launch (Recommended for Most Users)

Choose a platform when you want:
- Quick deployment without coding
- Built-in community features
- Automated liquidity management
- Social integration capabilities

### Custom Development (For Developers)

Build your own smart contract when you need:
- Custom tokenomics or functionality
- Full control over contract behavior
- Integration with existing systems
- Advanced security requirements

## Token Launch Platforms on Base

### Zora
**Best for:** Content creators and social tokens

Zora transforms every post into a tradeable ERC-20 token with automatic Uniswap integration. Each post becomes a "coin" with 1 billion supply, creators receive 10 million tokens, and earn 1% of all trading fees.

Key Features:
- Social-first token creation
- Automatic liquidity pools
- Revenue sharing for creators
- Built-in trading interface

Get started: https://zora.co/

### Clanker
**Best for:** Quick memecoin launches via social media

Clanker is an AI-driven token deployment tool that operates through Farcaster. Users can create ERC-20 tokens on Base by simply tagging @clanker with their token concept.

Key Features:
- AI-powered automation
- Social media integration via Farcaster
- Instant deployment
- Community-driven discovery

Get started: https://clanker.world

### Flaunch
**Best for:** Advanced memecoin projects with sophisticated tokenomics

Flaunch leverages Uniswap V4 to enable programmable revenue splits, automated buybacks, and Progressive Bid Walls for price support.

Key Features:
- Programmable revenue sharing
- Automated buyback mechanisms
- Progressive Bid Wall technology
- Treasury management tools

### Mint Club
**Best for:** Token families and community-driven assets

Mint Club enables anyone to launch new tokens or NFTs backed by existing ERC-20 tokens. Each trade locks the parent token in a bonding curve pool.

Key Features:
- Launch tokens or NFTs from any ERC-20 token
- Automated liquidity with customizable bonding curves
- Integrated trading interface with cross-chain swap
- Built-in airdrop and lock-up tools
- Creator revenue sharing

## Technical Implementation with Foundry

**Warning:** Before launching a custom developed token to production, always conduct security reviews by expert smart contract developers.

### Prerequisites

1. **Install Foundry**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. **Get Test ETH**
Obtain Base Sepolia ETH for testing from the Base Faucet: https://docs.base.org/docs/tools/network-faucets

3. **Set Up Development Environment**
Configure your wallet and development tools for Base testnet deployment

### Project Setup

Initialize a new Foundry project and clean up template files:

```bash
# Create new project
forge init my-token-project
cd my-token-project

# Remove template files we don't need
rm src/Counter.sol script/Counter.s.sol test/Counter.t.sol
```

Install OpenZeppelin contracts for secure, audited ERC-20 implementation:

```bash
# Install OpenZeppelin contracts library
forge install OpenZeppelin/openzeppelin-contracts
```

### Smart Contract Development

Create your token contract using OpenZeppelin's ERC-20 implementation:

**src/MyToken.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev ERC-20 token with minting capabilities and supply cap
 */
contract MyToken is ERC20, Ownable {
    // Maximum number of tokens that can ever exist
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        // Mint initial supply to the contract deployer
        _mint(initialOwner, initialSupply);
    }

    /**
     * @dev Mint new tokens (only contract owner can call this)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
```

### Deployment Script

Create a deployment script following Foundry best practices:

**script/DeployToken.s.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {MyToken} from "../src/MyToken.sol";

contract DeployToken is Script {
    function run() external {
        // Load deployer's private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Token configuration parameters
        string memory name = "My Token";
        string memory symbol = "MTK";
        uint256 initialSupply = 100_000_000 * 10**18; // 100 million tokens

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the token contract
        MyToken token = new MyToken(
            name,
            symbol,
            initialSupply,
            deployerAddress
        );

        // Stop broadcasting transactions
        vm.stopBroadcast();

        // Log deployment information
        console.log("Token deployed to:", address(token));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Initial supply:", token.totalSupply());
        console.log("Deployer balance:", token.balanceOf(deployerAddress));
    }
}
```

### Environment Configuration

Create a .env file with your configuration:

**.env**
```bash
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key_here
```

Update foundry.toml for Base network configuration:

**foundry.toml**
```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
remappings = ["@openzeppelin/=lib/openzeppelin-contracts/"]

[rpc_endpoints]
base_sepolia = "${BASE_SEPOLIA_RPC_URL}"
base_mainnet = "${BASE_MAINNET_RPC_URL}"

[etherscan]
base_sepolia = { key = "${BASESCAN_API_KEY}", url = "https://api-sepolia.basescan.org/api" }
base = { key = "${BASESCAN_API_KEY}", url = "https://api.basescan.org/api" }
```

### Testing

Create comprehensive tests for your token:

**test/MyToken.t.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public owner = address(0x1);
    address public user = address(0x2);
    uint256 constant INITIAL_SUPPLY = 100_000_000 * 10**18;

    function setUp() public {
        // Deploy token contract before each test
        vm.prank(owner);
        token = new MyToken("Test Token", "TEST", INITIAL_SUPPLY, owner);
    }

    function testInitialState() public {
        // Verify token was deployed with correct parameters
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
    }

    function testMinting() public {
        uint256 mintAmount = 1000 * 10**18;

        // Only owner should be able to mint
        vm.prank(owner);
        token.mint(user, mintAmount);

        assertEq(token.balanceOf(user), mintAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY + mintAmount);
    }

    function testBurning() public {
        uint256 burnAmount = 1000 * 10**18;

        // Owner burns their own tokens
        vm.prank(owner);
        token.burn(burnAmount);

        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - burnAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - burnAmount);
    }

    function testFailMintExceedsMaxSupply() public {
        // This test should fail when trying to mint more than max supply
        uint256 excessiveAmount = token.MAX_SUPPLY() + 1;

        vm.prank(owner);
        token.mint(user, excessiveAmount);
    }

    function testFailUnauthorizedMinting() public {
        // This test should fail when non-owner tries to mint
        vm.prank(user);
        token.mint(user, 1000 * 10**18);
    }
}
```

Run your tests:

```bash
# Run all tests with verbose output
forge test -vv
```

### Deployment and Verification

Deploy to Base Sepolia testnet:

```bash
# Load environment variables
source .env

# Deploy to Base Sepolia with automatic verification
forge script script/DeployToken.s.sol:DeployToken \
  --rpc-url base_sepolia \
  --broadcast \
  --verify
```

The `--verify` flag automatically verifies your contract on BaseScan, making it easier for users to interact with your token.

To deploy to Base Mainnet, simply change `base_sepolia` to `base_mainnet` in your deployment command. Ensure you have sufficient ETH on Base Mainnet for deployment and gas fees.

## Post-Launch Considerations

Once your token is deployed, here are the key next steps to consider:

### Token Distribution and Economics

Carefully consider your token's supply and distribution settings. Think through:
- How tokens will be distributed to your community, team, and ecosystem participants
- Vesting schedules
- Allocation percentages
- Long-term incentive alignment

### Community and Social Presence

Establish a community and social presence:
- Create documentation
- Set up social media accounts
- Engage with the Base ecosystem
- Build relationships with other projects and developers

### Liquidity and Trading

Add liquidity to decentralized exchanges like Uniswap to enable trading. Note:
- Token launchers will typically handle this automatically
- For custom deployments, you'll need to create trading pairs and provide initial liquidity

### Continued Development

For comprehensive guidance on growing your project on Base, including marketing strategies, ecosystem integration, and growth tactics, visit the Base Launch Playbook.

Remember to always prioritize security, transparency, and community value when developing and launching tokens. Consider conducting security audits and following best practices for token distribution.

## Resources

- **Base Quickstart Guide**: Complete guide to getting started on Base
- **Base Network Details**: Technical specifications and network information
- **Foundry Documentation**: Comprehensive guide to using Foundry
- **OpenZeppelin Contracts**: Security-focused smart contract library
- **BaseScan Explorer**: Explore transactions and contracts on Base
- **Base Faucet**: Get testnet ETH for development

### Community

- **Base Discord**: Join the Base community
- **Base Twitter**: Follow Base updates
- **Base GitHub**: Contribute to Base development

Whether you choose a platform-based approach for speed and convenience, or custom development for maximum control, Base provides a robust foundation for token launches. Start with the approach that best fits your technical expertise and project requirements, and leverage Base's growing ecosystem to build successful token projects.
