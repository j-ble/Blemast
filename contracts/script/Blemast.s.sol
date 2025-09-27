// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Blemast} from "../src/Blemast.sol";

contract BlemastScript is Script {
    function run() external returns (Blemast) {
        vm.startBroadcast();
        Blemast blemast = new Blemast(msg.sender);
        vm.stopBroadcast();
        return blemast;
    }
}
