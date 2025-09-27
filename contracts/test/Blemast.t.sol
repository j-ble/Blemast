// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Blemast} from "../src/Blemast.sol";

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
}
