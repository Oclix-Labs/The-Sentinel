// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AlertRegistry} from "../src/AlertRegistry.sol";

/// @title Deploy — forge script for AlertRegistry.
/// @notice Reads DEPLOYER_PRIVATE_KEY (uint256) and optionally ADMIN_ADDRESS
///         from env. Falls back to deployer address as admin if ADMIN_ADDRESS
///         is unset. Used for Base Sepolia (D3) and Base Mainnet (D5).
///
/// Usage:
///   forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
///   forge script script/Deploy.s.sol --rpc-url base_mainnet --broadcast --verify
contract Deploy is Script {
    function run() external returns (AlertRegistry registry) {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);
        address admin = vm.envOr("ADMIN_ADDRESS", deployer);

        console2.log("Deployer:", deployer);
        console2.log("Admin   :", admin);

        vm.startBroadcast(deployerKey);
        registry = new AlertRegistry(admin);
        vm.stopBroadcast();

        console2.log("AlertRegistry deployed at:", address(registry));
    }
}
