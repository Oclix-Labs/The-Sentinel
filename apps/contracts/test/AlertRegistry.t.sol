// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {AlertRegistry} from "../src/AlertRegistry.sol";

contract AlertRegistryTest is Test {
    // Re-declared locally so vm.expectEmit can match — Solidity can't emit another contract's event.
    event AlertLogged(
        uint256 indexed alertId,
        bytes32 indexed asset,
        bytes32 indexed oraclePair,
        int256 deviationBps,
        uint64 blockTimestamp,
        bytes32 evidenceHash,
        uint32 alertType
    );

    AlertRegistry internal registry;
    address internal admin = address(0xA11CE);
    address internal publisher = address(0xB0B);
    address internal stranger = address(0xDEAD);

    bytes32 internal constant CBETH_USD = keccak256("cbETH/USD");
    bytes32 internal constant CHAINLINK_VS_PYTH = keccak256("chainlink_vs_pyth");

    function setUp() public {
        registry = new AlertRegistry(admin);
    }

    function test_deployerIsPublisher() public view {
        assertTrue(registry.isPublisher(admin));
    }

    function test_logAlert_byPublisher_appendsAlert() public {
        bytes32 evidenceHash = keccak256("moonwell-cbeth-2026-02-15");
        int256 deviationBps = int256(-9995 * 10); // Moonwell cbETH magnitude: ~99.95%

        vm.expectEmit(true, true, true, true, address(registry));
        emit AlertLogged(
            0,
            CBETH_USD,
            CHAINLINK_VS_PYTH,
            deviationBps,
            uint64(block.timestamp),
            evidenceHash,
            uint32(0)
        );

        vm.prank(admin);
        uint256 alertId = registry.logAlert(
            CBETH_USD,
            CHAINLINK_VS_PYTH,
            deviationBps,
            evidenceHash,
            uint32(0)
        );

        assertEq(alertId, 0);
        assertEq(registry.alertCount(), 1);
    }

    function test_logAlert_revertsIfNotPublisher() public {
        vm.prank(stranger);
        vm.expectRevert(AlertRegistry.NotPublisher.selector);
        registry.logAlert(
            CBETH_USD,
            CHAINLINK_VS_PYTH,
            int256(100),
            bytes32(0),
            uint32(0)
        );
    }

    function test_setPublisher_byAdmin_addsPublisher() public {
        vm.prank(admin);
        registry.setPublisher(publisher, true);
        assertTrue(registry.isPublisher(publisher));
    }

    function test_setPublisher_revertsIfNotAdmin() public {
        vm.prank(stranger);
        vm.expectRevert(AlertRegistry.NotAdmin.selector);
        registry.setPublisher(publisher, true);
    }

    function test_transferAdmin_succeeds() public {
        vm.prank(admin);
        registry.transferAdmin(publisher);
        assertEq(registry.admin(), publisher);
    }

    function test_logAlert_loop_9Times() public {
        // Shape test: 9 sequential logAlert calls with varying deviation magnitudes
        // and unique evidence hashes all succeed.
        // True Moonwell 9-incident replay (real dates + deviations from
        // .research/incident-forensics-moonwell.md) is deferred to D7 when the
        // incident data is locked in and the repo goes public.
        vm.startPrank(admin);
        for (uint256 i; i < 9; ++i) {
            // forge-lint: disable-next-line(unsafe-typecast)
            int256 deviation = int256(i) * -1000;
            registry.logAlert(
                CBETH_USD,
                CHAINLINK_VS_PYTH,
                deviation,
                keccak256(abi.encodePacked("incident-", i)),
                uint32(0)
            );
        }
        vm.stopPrank();
        assertEq(registry.alertCount(), 9);
    }
}
