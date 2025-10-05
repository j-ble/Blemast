# ERC-20 Token Standard Documentation

## Overview

The ERC-20 Token Standard defines a common interface for fungible tokens on the Ethereum blockchain. This standard allows tokens to be re-used across different applications including wallets, decentralized exchanges, and other smart contracts.

**Created by**: Fabian Vogelsteller and Vitalik Buterin (November 2015)
**Official Specification**: [EIP-20](https://eips.ethereum.org/EIPS/eip-20)

---

## Abstract

A standard interface for tokens within smart contracts, providing basic functionality to transfer tokens and allow tokens to be approved by third parties.

## Motivation

A standard interface allows any tokens on Ethereum to be re-used by other applications: from wallets to decentralized exchanges. This standardization enables interoperability and composability across the Ethereum ecosystem.

---

## Core Specification

### Required Methods

#### `totalSupply()`
```solidity
function totalSupply() public view returns (uint256)
```
Returns the total token supply.

#### `balanceOf(address _owner)`
```solidity
function balanceOf(address _owner) public view returns (uint256 balance)
```
Returns the account balance of an address.

#### `transfer(address _to, uint256 _value)`
```solidity
function transfer(address _to, uint256 _value) public returns (bool success)
```
Transfers `_value` amount of tokens to address `_to`. Must fire the `Transfer` event.

#### `transferFrom(address _from, address _to, uint256 _value)`
```solidity
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
```
Transfers `_value` amount of tokens from address `_from` to address `_to`. Used for a withdraw workflow with the `approve` function. Must fire the `Transfer` event.

#### `approve(address _spender, uint256 _value)`
```solidity
function approve(address _spender, uint256 _value) public returns (bool success)
```
Allows `_spender` to withdraw from your account multiple times, up to the `_value` amount. Must fire the `Approval` event.

**Security Note**: To prevent attack vectors, it's recommended to first set allowance to `0` before changing to another value for the same spender.

#### `allowance(address _owner, address _spender)`
```solidity
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```
Returns the amount which `_spender` is still allowed to withdraw from `_owner`.

### Required extensions

#### `name()`
```solidity
function name() public view returns (string)
```
Returns the token name (e.g., "MyToken").

#### `symbol()`
```solidity
function symbol() public view returns (string)
```
Returns the token symbol (e.g., "MTK").

#### `decimals()`
```solidity
function decimals() public view returns (uint8)
```
Returns the number of decimals the token uses (e.g., `18` means to divide the token amount by `1000000000000000000` to get its user representation).

### Events

#### `Transfer`
```solidity
event Transfer(address indexed _from, address indexed _to, uint256 _value)
```
Must trigger when tokens are transferred, including zero value transfers. Token creation should trigger a Transfer event with `_from` set to `0x0`.

#### `Approval`
```solidity
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```
Must trigger on any successful call to `approve(address _spender, uint256 _value)`.

---

## OpenZeppelin Implementation

OpenZeppelin provides battle-tested, secure implementations of the ERC-20 standard.

### Core Contracts

#### `IERC20`
The fundamental interface that all ERC-20 tokens must conform to. Defines the required methods and events.

#### `IERC20Metadata`
Extended interface adding the optional metadata functions: `name()`, `symbol()`, and `decimals()`.

#### `ERC20`
Standard implementation of the ERC-20 interface. This is the base contract most tokens should inherit from.

**Import Path**: `@openzeppelin/contracts/token/ERC20/ERC20.sol`

---

## OpenZeppelin Extensions

OpenZeppelin provides several extensions to add functionality to base ERC-20 tokens:

### Access Control & Security

#### `ERC20Pausable`
Adds ability to pause and unpause token transfers. Useful for emergency stops or maintenance.

**Use Case**: Emergency response, upgrading contracts, preventing trading during critical periods.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol`

#### `ERC20Permit`
Implements gasless token approvals using EIP-2612. Users can sign approval messages off-chain, which can then be submitted by another party.

**Use Case**: Improve UX by eliminating the need for a separate approval transaction.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol`

### Supply Management

#### `ERC20Burnable`
Enables token holders to destroy (burn) their own tokens, reducing total supply.

**Use Case**: Deflationary tokens, token buyback and burn mechanisms.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol`

#### `ERC20Capped`
Enforces a maximum supply cap for the token. No more tokens can be minted once the cap is reached.

**Use Case**: Tokens with a fixed maximum supply.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol`

#### `ERC20FlashMint`
Adds token-level support for flash loans through the ERC-3156 standard.

**Use Case**: DeFi protocols, arbitrage opportunities, liquidations.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol`

### Governance

#### `ERC20Votes`
Adds voting capabilities and vote delegation for governance systems. Tracks voting power and enables delegation.

**Use Case**: DAO governance tokens, voting mechanisms.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol`

### Advanced Functionality

#### `ERC20Wrapper`
Enables wrapping of another ERC-20 token in a 1:1 ratio. Useful for adding functionality to existing tokens.

**Use Case**: Adding governance to non-governance tokens, upgrading token functionality.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol`

#### `ERC4626`
Implements the tokenized vault standard for yield-bearing tokens. Standardizes vault interfaces for yield aggregators.

**Use Case**: Yield farming, vault strategies, DeFi protocols.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol`

#### `ERC1363`
Adds special transfer and approval mechanisms that allow contracts to be notified when they receive tokens or approvals.

**Use Case**: Payable tokens, automatic interaction triggers.

**Import**: `@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol`

### Draft Extensions (Experimental)

- `ERC20Bridgeable`: Cross-chain bridge functionality
- `ERC20TemporaryApproval`: Time-limited approvals

---

## OpenZeppelin Utilities

### `SafeERC20`
A wrapper library around the ERC-20 interface that eliminates the need to handle boolean return values. Provides safe versions of `transfer`, `transferFrom`, and `approve` that revert on failure.

**Key Functions**:
- `safeTransfer(IERC20 token, address to, uint256 value)`
- `safeTransferFrom(IERC20 token, address from, address to, uint256 value)`
- `safeApprove(IERC20 token, address spender, uint256 value)`
- `safeIncreaseAllowance(IERC20 token, address spender, uint256 value)`
- `safeDecreaseAllowance(IERC20 token, address spender, uint256 value)`

**Use Case**: Safely interact with any ERC-20 token, including non-standard implementations.

**Import**: `@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol`

### `ERC1363Utils`
Utility functions for the ERC-1363 token standard, providing helper methods for transfer and approval callbacks.

**Import**: `@openzeppelin/contracts/token/ERC20/utils/ERC1363Utils.sol`

---

## Building the Perfect ERC-20 Token

### Basic Token Template

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}
```

### Advanced Token with Extensions

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdvancedToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    ERC20Permit,
    ERC20Votes,
    Ownable
{
    constructor(address initialOwner)
        ERC20("AdvancedToken", "ADV")
        ERC20Permit("AdvancedToken")
        Ownable(initialOwner)
    {
        _mint(initialOwner, 1000000 * 10 ** decimals());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Required overrides
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
```

### Capped Supply Token

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CappedToken is ERC20, ERC20Capped, Ownable {
    constructor(uint256 cap, address initialOwner)
        ERC20("CappedToken", "CAP")
        ERC20Capped(cap)
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Required override
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
```

---

## Best Practices

### Security Considerations

1. **Approval Race Condition**: Use `safeIncreaseAllowance` and `safeDecreaseAllowance` instead of `approve` when possible
2. **Reentrancy**: Be cautious with hooks and callbacks in extensions like ERC1363
3. **Integer Overflow**: Solidity 0.8+ has built-in overflow protection, but be mindful in calculations
4. **Access Control**: Use OpenZeppelin's `Ownable` or `AccessControl` for privileged functions
5. **Pausability**: Implement pause mechanisms for emergency situations

### Design Patterns

1. **Minimal Proxy**: Use for creating multiple token instances efficiently
2. **Upgradeable Contracts**: Consider using OpenZeppelin's upgradeable contracts for future improvements
3. **Gas Optimization**: Be mindful of storage operations and loop iterations
4. **Event Emission**: Always emit events for state changes to enable proper indexing

### Testing Requirements

- Test all core functions (transfer, approve, transferFrom)
- Test edge cases (zero transfers, self-transfers, insufficient balance)
- Test access control on privileged functions
- Test pause/unpause functionality if implemented
- Test burning mechanisms if implemented
- Verify correct event emissions
- Gas usage benchmarking

### Deployment Checklist

- [ ] Audit smart contract code
- [ ] Verify total supply and initial distribution
- [ ] Set correct decimals (18 is standard)
- [ ] Configure access control properly
- [ ] Test on testnet extensively
- [ ] Verify contract on block explorer
- [ ] Document all functions and features
- [ ] Set up monitoring and alerts

---

## Common Extensions Comparison

| Extension | Purpose | Gas Cost | Complexity | Use Case |
|-----------|---------|----------|------------|----------|
| ERC20Burnable | Token burning | Low | Low | Deflationary tokens |
| ERC20Pausable | Emergency stop | Medium | Low | Security features |
| ERC20Capped | Supply limit | Low | Low | Fixed supply tokens |
| ERC20Permit | Gasless approvals | Medium | Medium | UX improvement |
| ERC20Votes | Governance | High | High | DAO tokens |
| ERC20FlashMint | Flash loans | Medium | Medium | DeFi protocols |
| ERC4626 | Tokenized vaults | High | High | Yield aggregation |

---

## Resources

- [EIP-20 Official Specification](https://eips.ethereum.org/EIPS/eip-20)
- [OpenZeppelin ERC20 Documentation](https://docs.openzeppelin.com/contracts/5.x/erc20)
- [OpenZeppelin Contracts Repository](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Solidity Documentation](https://docs.soliditylang.org/)

---

## Conclusion

The ERC-20 standard provides a robust foundation for fungible tokens on Ethereum. By leveraging OpenZeppelin's battle-tested implementations and extensions, developers can build secure, feature-rich tokens tailored to their specific use cases. Always prioritize security, follow best practices, and thoroughly test before deployment.
