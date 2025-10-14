// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Blemast Token (BLE)
 * @notice ERC20 token with burn, pause, permit, and role-based minting capabilities
 * @dev Extends OpenZeppelin's ERC20 with additional features:
 *      - Burnable: Token holders can burn their own tokens
 *      - Pausable: Authorized pausers can pause/unpause all transfers
 *      - Permit: Gasless approvals via EIP-2612
 *      - AccessControl: Role-based permissions for minting and pausing
 *      - Max Supply: 1 billion BLE tokens maximum
 *      - Rate Limiting: Minting rate limited to prevent inflation shocks
 */
contract Blemast is ERC20, ERC20Burnable, ERC20Pausable, ERC20Permit, AccessControl {
    // ============ Constants ============

    /// @notice Maximum supply cap - 1 billion BLE tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    /// @notice Initial supply minted to deployer - 100 million BLE tokens (10% of total supply)
    uint256 private constant INITIAL_SUPPLY = 100_000_000 * 10**18;

    /// @notice Cooldown period between mint operations - 1 day
    uint256 public constant MINT_COOLDOWN = 1 days;

    /// @notice Maximum amount that can be minted per cooldown period - 100k BLE
    uint256 public constant MAX_MINT_PER_PERIOD = 100_000 * 10**18;

    /// @notice Role identifier for accounts authorized to mint tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role identifier for accounts authorized to pause/unpause transfers
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // ============ State Variables ============

    /// @notice Timestamp of the last mint operation
    uint256 public lastMintTimestamp;

    /// @notice Amount minted in the current cooldown period
    uint256 public mintedInCurrentPeriod;

    // ============ Custom Errors ============

    /// @dev Thrown when trying to mint more than MAX_SUPPLY
    error MaxSupplyExceeded(uint256 requestedTotal, uint256 maxSupply);

    /// @dev Thrown when constructor receives zero address
    error ZeroAddress();

    /// @dev Thrown when initial supply would exceed max supply
    error InitialSupplyExceedsMaxSupply(uint256 initialSupply, uint256 maxSupply);

    /// @dev Thrown when mint rate limit is exceeded
    error MintRateLimitExceeded(uint256 requestedAmount, uint256 availableAmount);

    /// @dev Thrown when trying to mint zero tokens
    error MintAmountZero();

    // ============ Events ============

    /// @notice Emitted when tokens are minted
    event Minted(address indexed to, uint256 amount, address indexed minter);

    /// @notice Emitted when contract is paused
    event ContractPaused(address indexed pauser, uint256 timestamp);

    /// @notice Emitted when contract is unpaused
    event ContractUnpaused(address indexed unpauser, uint256 timestamp);

    // ============ Constructor ============

    /**
     * @notice Initializes the Blemast token
     * @param initialOwner Address that will receive admin roles and initial supply
     * @dev Grants DEFAULT_ADMIN_ROLE, MINTER_ROLE, and PAUSER_ROLE to initialOwner
     */
    constructor(address initialOwner)
        ERC20("Blemast", "BLE")
        ERC20Permit("Blemast")
    {
        if (initialOwner == address(0)) revert ZeroAddress();
        if (INITIAL_SUPPLY > MAX_SUPPLY) {
            revert InitialSupplyExceedsMaxSupply(INITIAL_SUPPLY, MAX_SUPPLY);
        }

        // Grant roles to initial owner
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);

        // Initialize mint tracking
        lastMintTimestamp = block.timestamp;
        mintedInCurrentPeriod = INITIAL_SUPPLY;

        // Mint initial supply to owner
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    // ============ External Functions ============

    /**
     * @notice Pauses all token transfers
     * @dev Only callable by accounts with PAUSER_ROLE
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit ContractPaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Unpauses all token transfers
     * @dev Only callable by accounts with PAUSER_ROLE
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Mints new tokens to a specified address
     * @dev Only callable by accounts with MINTER_ROLE
     *      Subject to MAX_SUPPLY cap and rate limiting
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (amount == 0) revert MintAmountZero();

        // Check max supply cap
        uint256 newTotalSupply = totalSupply() + amount;
        if (newTotalSupply > MAX_SUPPLY) {
            revert MaxSupplyExceeded(newTotalSupply, MAX_SUPPLY);
        }

        // Reset minting period if cooldown has passed
        if (block.timestamp >= lastMintTimestamp + MINT_COOLDOWN) {
            mintedInCurrentPeriod = 0;
            lastMintTimestamp = block.timestamp;
        }

        // Check rate limit
        uint256 newPeriodTotal = mintedInCurrentPeriod + amount;
        if (newPeriodTotal > MAX_MINT_PER_PERIOD) {
            // Calculate available amount safely (handle case where already exceeded limit)
            uint256 available = mintedInCurrentPeriod >= MAX_MINT_PER_PERIOD
                ? 0
                : MAX_MINT_PER_PERIOD - mintedInCurrentPeriod;
            revert MintRateLimitExceeded(amount, available);
        }

        // Update period tracking
        mintedInCurrentPeriod = newPeriodTotal;

        // Mint tokens
        _mint(to, amount);
        emit Minted(to, amount, msg.sender);
    }

    // ============ View Functions ============

    /**
     * @notice Returns the amount available to mint in the current period
     * @return Available mint amount before hitting rate limit
     */
    function availableMintAmount() external view returns (uint256) {
        // If cooldown has passed, full amount is available
        if (block.timestamp >= lastMintTimestamp + MINT_COOLDOWN) {
            return MAX_MINT_PER_PERIOD;
        }

        // Otherwise return remaining amount in current period
        // Handle case where already minted more than limit (e.g., in constructor)
        if (mintedInCurrentPeriod >= MAX_MINT_PER_PERIOD) {
            return 0;
        }
        return MAX_MINT_PER_PERIOD - mintedInCurrentPeriod;
    }

    /**
     * @notice Returns seconds until next minting period resets
     * @return Seconds remaining in cooldown period (0 if period has passed)
     */
    function timeUntilNextPeriod() external view returns (uint256) {
        uint256 nextPeriod = lastMintTimestamp + MINT_COOLDOWN;
        if (block.timestamp >= nextPeriod) {
            return 0;
        }
        return nextPeriod - block.timestamp;
    }

    // ============ Internal Functions ============

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
