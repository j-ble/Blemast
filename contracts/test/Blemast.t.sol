// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Blemast} from "../src/Blemast.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract BlemastTest is Test {
    Blemast public blemast;
    address public owner;
    address public minter;
    address public pauser;
    address public user;

    // Events to test
    event Minted(address indexed to, uint256 amount, address indexed minter);
    event ContractPaused(address indexed pauser, uint256 timestamp);
    event ContractUnpaused(address indexed unpauser, uint256 timestamp);

    function setUp() public {
        owner = address(this);
        minter = address(0x1);
        pauser = address(0x2);
        user = address(0x3);

        blemast = new Blemast(owner);

        // Grant additional roles for testing
        blemast.grantRole(blemast.MINTER_ROLE(), minter);
        blemast.grantRole(blemast.PAUSER_ROLE(), pauser);
    }

    // ============ Constructor Tests ============

    function testConstructor_InitialSupply() public view {
        assertEq(blemast.balanceOf(owner), 100_000_000 * 10**18);
        assertEq(blemast.totalSupply(), 100_000_000 * 10**18);
    }

    function testConstructor_RolesGranted() public view {
        assertTrue(blemast.hasRole(blemast.DEFAULT_ADMIN_ROLE(), owner));
        assertTrue(blemast.hasRole(blemast.MINTER_ROLE(), owner));
        assertTrue(blemast.hasRole(blemast.PAUSER_ROLE(), owner));
    }

    function testConstructor_MintTrackingInitialized() public view {
        assertEq(blemast.lastMintTimestamp(), block.timestamp);
        assertEq(blemast.mintedInCurrentPeriod(), 100_000_000 * 10**18);
    }

    function testConstructor_RevertsOnZeroAddress() public {
        vm.expectRevert(Blemast.ZeroAddress.selector);
        new Blemast(address(0));
    }

    // ============ Basic Token Tests ============

    function testName() public view {
        assertEq(blemast.name(), "Blemast");
    }

    function testSymbol() public view {
        assertEq(blemast.symbol(), "BLE");
    }

    function testDecimals() public view {
        assertEq(blemast.decimals(), 18);
    }

    function testConstants() public view {
        assertEq(blemast.MAX_SUPPLY(), 1_000_000_000 * 10**18);
        assertEq(blemast.MINT_COOLDOWN(), 1 days);
        assertEq(blemast.MAX_MINT_PER_PERIOD(), 100_000 * 10**18);
    }

    // ============ Minting Tests ============

    function testMint_Success() public {
        // Need to warp time forward since initial supply exceeded rate limit
        vm.warp(block.timestamp + 1 days);

        vm.prank(minter);
        blemast.mint(user, 100 ether);
        assertEq(blemast.balanceOf(user), 100 ether);
    }

    function testMint_EmitsEvent() public {
        // Need to warp time forward since initial supply exceeded rate limit
        vm.warp(block.timestamp + 1 days);

        vm.expectEmit(true, true, true, true);
        emit Minted(user, 100 ether, minter);

        vm.prank(minter);
        blemast.mint(user, 100 ether);
    }

    function testMint_RevertsOnZeroAmount() public {
        vm.expectRevert(Blemast.MintAmountZero.selector);
        vm.prank(minter);
        blemast.mint(user, 0);
    }

    function testMint_RevertsWhenExceedingMaxSupply() public {
        // Try to mint more than MAX_SUPPLY allows
        uint256 excessAmount = blemast.MAX_SUPPLY() - blemast.totalSupply() + 1;

        vm.expectRevert(
            abi.encodeWithSelector(
                Blemast.MaxSupplyExceeded.selector,
                blemast.totalSupply() + excessAmount,
                blemast.MAX_SUPPLY()
            )
        );
        vm.prank(minter);
        blemast.mint(user, excessAmount);
    }

    function testMint_SucceedsAtExactMaxSupply() public {
        // Calculate amount to reach MAX_SUPPLY
        uint256 remainingSupply = blemast.MAX_SUPPLY() - blemast.totalSupply();

        // Need to wait for cooldown to reset and mint in chunks due to rate limiting
        vm.warp(block.timestamp + 1 days);

        uint256 mintedSoFar = 0;
        while (mintedSoFar < remainingSupply) {
            uint256 toMint = remainingSupply - mintedSoFar;
            if (toMint > blemast.MAX_MINT_PER_PERIOD()) {
                toMint = blemast.MAX_MINT_PER_PERIOD();
            }

            vm.prank(minter);
            blemast.mint(user, toMint);
            mintedSoFar += toMint;

            if (mintedSoFar < remainingSupply) {
                vm.warp(block.timestamp + 1 days);
            }
        }

        assertEq(blemast.totalSupply(), blemast.MAX_SUPPLY());
    }

    function testMint_RevertsWithoutMinterRole() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                user,
                blemast.MINTER_ROLE()
            )
        );
        vm.prank(user);
        blemast.mint(user, 100 ether);
    }

    // ============ Rate Limiting Tests ============

    function testMint_RateLimitEnforced() public {
        // Warp to new period with fresh rate limit
        vm.warp(block.timestamp + 1 days);

        // First mint within limit should succeed
        vm.prank(minter);
        blemast.mint(user, 50_000 ether);

        // Second mint exceeding limit should fail
        vm.expectRevert(
            abi.encodeWithSelector(
                Blemast.MintRateLimitExceeded.selector,
                60_000 ether,
                50_000 ether
            )
        );
        vm.prank(minter);
        blemast.mint(user, 60_000 ether);
    }

    function testMint_RateLimitResetsAfterCooldown() public {
        // Warp to new period
        vm.warp(block.timestamp + 1 days);

        // First mint
        vm.prank(minter);
        blemast.mint(user, 100_000 ether);

        // Try to mint again immediately - should fail
        vm.expectRevert();
        vm.prank(minter);
        blemast.mint(user, 1 ether);

        // Warp time forward past cooldown
        vm.warp(block.timestamp + 1 days);

        // Now should succeed
        vm.prank(minter);
        blemast.mint(user, 100_000 ether);
        assertEq(blemast.balanceOf(user), 200_000 ether);
    }

    function testMint_TracksCurrentPeriod() public {
        // Warp to new period
        vm.warp(block.timestamp + 1 days);

        // After warping, the NEXT mint will reset the period
        // So we mint once to reset, then check tracking
        vm.prank(minter);
        blemast.mint(user, 50_000 ether);

        // Now period should be 50k
        assertEq(blemast.mintedInCurrentPeriod(), 50_000 ether);

        // Mint again and verify it tracks correctly
        vm.prank(minter);
        blemast.mint(user, 25_000 ether);

        assertEq(blemast.mintedInCurrentPeriod(), 75_000 ether);
    }

    function testAvailableMintAmount_InCurrentPeriod() public view {
        // Initial supply was minted in constructor, so only (MAX_MINT_PER_PERIOD - INITIAL_SUPPLY) available
        uint256 expected = 0; // Since initial supply (100M) > MAX_MINT_PER_PERIOD (100k)
        assertEq(blemast.availableMintAmount(), expected);
    }

    function testAvailableMintAmount_AfterCooldown() public {
        vm.warp(block.timestamp + 1 days);
        assertEq(blemast.availableMintAmount(), blemast.MAX_MINT_PER_PERIOD());
    }

    function testAvailableMintAmount_PartialPeriodUsage() public {
        // Warp to new period with fresh rate limit
        vm.warp(block.timestamp + 1 days);

        // Mint partial amount (30k out of 100k available)
        uint256 partialAmount = 30_000 ether;
        vm.prank(minter);
        blemast.mint(user, partialAmount);

        // Verify available amount returns the remainder
        uint256 expected = blemast.MAX_MINT_PER_PERIOD() - partialAmount;
        assertEq(blemast.availableMintAmount(), expected);
        assertEq(blemast.availableMintAmount(), 70_000 ether);
    }

    function testTimeUntilNextPeriod_DuringCooldown() public {
        uint256 expectedTime = 1 days;
        assertEq(blemast.timeUntilNextPeriod(), expectedTime);
    }

    function testTimeUntilNextPeriod_AfterCooldown() public {
        vm.warp(block.timestamp + 1 days + 1);
        assertEq(blemast.timeUntilNextPeriod(), 0);
    }

    // ============ Pause/Unpause Tests ============

    function testPause_Success() public {
        vm.prank(pauser);
        blemast.pause();
        assertTrue(blemast.paused());
    }

    function testPause_EmitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit ContractPaused(pauser, block.timestamp);

        vm.prank(pauser);
        blemast.pause();
    }

    function testPause_BlocksTransfers() public {
        vm.prank(pauser);
        blemast.pause();

        vm.expectRevert(abi.encodeWithSelector(Pausable.EnforcedPause.selector));
        blemast.transfer(user, 100 ether);
    }

    function testPause_RevertsWithoutPauserRole() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                user,
                blemast.PAUSER_ROLE()
            )
        );
        vm.prank(user);
        blemast.pause();
    }

    function testUnpause_Success() public {
        vm.prank(pauser);
        blemast.pause();

        vm.prank(pauser);
        blemast.unpause();
        assertFalse(blemast.paused());
    }

    function testUnpause_EmitsEvent() public {
        vm.prank(pauser);
        blemast.pause();

        vm.expectEmit(true, false, false, true);
        emit ContractUnpaused(pauser, block.timestamp);

        vm.prank(pauser);
        blemast.unpause();
    }

    function testUnpause_AllowsTransfers() public {
        vm.prank(pauser);
        blemast.pause();

        vm.prank(pauser);
        blemast.unpause();

        blemast.transfer(user, 100 ether);
        assertEq(blemast.balanceOf(user), 100 ether);
    }

    function testUnpause_RevertsWithoutPauserRole() public {
        vm.prank(pauser);
        blemast.pause();

        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                user,
                blemast.PAUSER_ROLE()
            )
        );
        vm.prank(user);
        blemast.unpause();
    }

    // ============ Burn Tests ============

    function testBurn_Success() public {
        uint256 initialBalance = blemast.balanceOf(owner);
        uint256 burnAmount = 100 ether;

        blemast.burn(burnAmount);

        assertEq(blemast.balanceOf(owner), initialBalance - burnAmount);
        assertEq(blemast.totalSupply(), initialBalance - burnAmount);
    }

    function testBurn_ReducesTotalSupply() public {
        uint256 initialSupply = blemast.totalSupply();
        blemast.burn(100 ether);
        assertEq(blemast.totalSupply(), initialSupply - 100 ether);
    }

    function testBurnFrom_Success() public {
        // Owner approves user to burn their tokens
        blemast.approve(user, 100 ether);

        uint256 initialBalance = blemast.balanceOf(owner);

        vm.prank(user);
        blemast.burnFrom(owner, 100 ether);

        assertEq(blemast.balanceOf(owner), initialBalance - 100 ether);
    }

    // ============ Transfer Tests ============

    function testTransfer_Success() public {
        blemast.transfer(user, 100 ether);
        assertEq(blemast.balanceOf(user), 100 ether);
    }

    function testTransferFrom_Success() public {
        blemast.approve(minter, 100 ether);

        vm.prank(minter);
        blemast.transferFrom(owner, user, 100 ether);

        assertEq(blemast.balanceOf(user), 100 ether);
    }

    // ============ Access Control Tests ============

    function testAccessControl_GrantRole() public {
        address newMinter = address(0x4);

        blemast.grantRole(blemast.MINTER_ROLE(), newMinter);
        assertTrue(blemast.hasRole(blemast.MINTER_ROLE(), newMinter));
    }

    function testAccessControl_RevokeRole() public {
        blemast.revokeRole(blemast.MINTER_ROLE(), minter);
        assertFalse(blemast.hasRole(blemast.MINTER_ROLE(), minter));
    }

    function testAccessControl_RenounceRole() public {
        // Setup: Ensure minter has the role
        assertTrue(blemast.hasRole(blemast.MINTER_ROLE(), minter));

        // The calling account must match the account parameter in renounceRole
        vm.startPrank(minter);
        blemast.renounceRole(blemast.MINTER_ROLE(), minter);
        vm.stopPrank();

        assertFalse(blemast.hasRole(blemast.MINTER_ROLE(), minter));
    }

    function testAccessControl_HasRole() public view {
        // Verify role checks work correctly
        assertTrue(blemast.hasRole(blemast.DEFAULT_ADMIN_ROLE(), owner));
        assertTrue(blemast.hasRole(blemast.MINTER_ROLE(), minter));
        assertTrue(blemast.hasRole(blemast.PAUSER_ROLE(), pauser));
        assertFalse(blemast.hasRole(blemast.MINTER_ROLE(), user));
    }

    // ============ Permit Tests ============

    function testNonces_InitialValue() public view {
        assertEq(blemast.nonces(owner), 0);
    }

    function testPermit_ValidSignature() public {
        uint256 privateKey = 0xA11CE;
        address holder = vm.addr(privateKey);

        // Mint some tokens to holder
        vm.prank(minter);
        vm.warp(block.timestamp + 1 days);
        blemast.mint(holder, 100 ether);

        uint256 nonce = blemast.nonces(holder);
        uint256 deadline = block.timestamp + 1 hours;

        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                holder,
                user,
                100 ether,
                nonce,
                deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                blemast.DOMAIN_SEPARATOR(),
                structHash
            )
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);

        blemast.permit(holder, user, 100 ether, deadline, v, r, s);

        assertEq(blemast.allowance(holder, user), 100 ether);
        assertEq(blemast.nonces(holder), nonce + 1);
    }

    // ============ Fuzz Tests ============

    function testFuzz_Mint_NeverExceedsMaxSupply(uint256 amount) public {
        vm.assume(amount > 0 && amount <= blemast.MAX_MINT_PER_PERIOD());

        uint256 availableSupply = blemast.MAX_SUPPLY() - blemast.totalSupply();

        if (amount <= availableSupply) {
            vm.warp(block.timestamp + 1 days);
            vm.prank(minter);
            blemast.mint(user, amount);
            assertLe(blemast.totalSupply(), blemast.MAX_SUPPLY());
        }
    }

    function testFuzz_Transfer_BalanceInvariant(address to, uint256 amount) public {
        vm.assume(to != address(0) && to != owner);
        vm.assume(amount > 0 && amount <= blemast.balanceOf(owner));

        uint256 totalBefore = blemast.totalSupply();

        blemast.transfer(to, amount);

        assertEq(blemast.totalSupply(), totalBefore);
        assertEq(blemast.balanceOf(owner) + blemast.balanceOf(to), totalBefore);
    }

    function testFuzz_Burn_ReducesSupply(uint256 amount) public {
        vm.assume(amount > 0 && amount <= blemast.balanceOf(owner));

        uint256 supplyBefore = blemast.totalSupply();

        blemast.burn(amount);

        assertEq(blemast.totalSupply(), supplyBefore - amount);
    }
}
