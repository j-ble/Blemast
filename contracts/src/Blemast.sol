// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Blemast Token (BLE)
 * @notice ERC20 token with burn, pause, permit, and owner-controlled minting capabilities
 * @dev Extends OpenZeppelin's ERC20 with additional features:
 *      - Burnable: Token holders can burn their own tokens
 *      - Pausable: Owner can pause/unpause all transfers
 *      - Permit: Gasless approvals via EIP-2612
 *      - Ownable: Owner-controlled minting
 */
contract Blemast is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, Ownable {
    /**
     * @notice Initializes the Blemast token
     * @param initialOwner Address that will own the contract and receive initial supply
     */
    constructor(address initialOwner)
        ERC20("Blemast", "BLE")
        ERC20Permit("Blemast")
        Ownable(initialOwner)
    {
        // Mint initial supply to owner (1 million BLE tokens)
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }

    /**
     * @notice Pauses all token transfers
     * @dev Only callable by owner
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @notice Unpauses all token transfers
     * @dev Only callable by owner
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @notice Mints new tokens to a specified address
     * @dev Only callable by owner
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Required override for _update function when using multiple extensions
     * @param from Address tokens are transferred from
     * @param to Address tokens are transferred to
     * @param value Amount of tokens transferred
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }

    /**
     * @dev Required override for nonces function when using ERC20Permit
     * @param owner Address to get nonce for
     * @return Current nonce for the owner
     */
    function nonces(address owner)
        public
        view
        override(ERC20Permit)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
