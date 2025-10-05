// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Blemast} from "../src/Blemast.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract BlemastTest is Test {
    Blemast public blemast;

    function setUp() public {
        blemast = new Blemast(address(this));
    }

    function testName() public view {
        assertEq(blemast.name(), "Blemast");
    }

    function testSymbol() public view {
        assertEq(blemast.symbol(), "BLE");
    }

    function testMint() public {
        blemast.mint(address(1), 100 ether);
        assertEq(blemast.balanceOf(address(1)), 100 ether);
    }

    function testPauseAndUnpause() public {
        blemast.mint(address(this), 100 ether);
        assertEq(blemast.balanceOf(address(this)), 1_000_100 ether);

        blemast.pause();

        vm.expectRevert(abi.encodeWithSelector(Pausable.EnforcedPause.selector));
        blemast.transfer(address(2), 10 ether);

        blemast.unpause();

        blemast.transfer(address(2), 10 ether);
        assertEq(blemast.balanceOf(address(2)), 10 ether);
    }

    function testPauseAndUnpauseFromNonOwner() public {
        vm.startPrank(address(2));
        vm.expectRevert();
        blemast.pause();
        vm.expectRevert();
        blemast.unpause();
        vm.stopPrank();
    }

    function testBurn() public {
        uint256 initialBalance = blemast.balanceOf(address(this));
        blemast.burn(100 ether);
        assertEq(blemast.balanceOf(address(this)), initialBalance - 100 ether);
    }

    function testNonces() public view {
        uint256 nonce = blemast.nonces(address(this));
        assertEq(nonce, 0);
    }
}
