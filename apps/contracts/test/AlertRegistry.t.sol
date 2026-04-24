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
        int128 deviationBps,
        uint64 blockTimestamp,
        bytes32 evidenceHash,
        uint32 alertType
    );
    event AdminTransferInitiated(address indexed currentAdmin, address indexed pendingAdmin);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

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
        int128 deviationBps = int128(9995 * 10); // Moonwell cbETH magnitude: ~99.95% (unsigned per ADR 0007 §4)

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

        // Readback: verify on-chain struct round-trips the exact inputs.
        (
            bytes32 rAsset,
            bytes32 rOraclePair,
            bytes32 rEvidenceHash,
            int128 rDeviationBps,
            uint64 rBlockTimestamp,
            uint32 rAlertType
        ) = registry.alerts(0);
        assertEq(rAsset, CBETH_USD);
        assertEq(rOraclePair, CHAINLINK_VS_PYTH);
        assertEq(rEvidenceHash, evidenceHash);
        assertEq(rDeviationBps, deviationBps);
        assertEq(uint256(rBlockTimestamp), block.timestamp);
        assertEq(rAlertType, uint32(0));
    }

    function test_logAlert_revertsIfNotPublisher() public {
        vm.prank(stranger);
        vm.expectRevert(AlertRegistry.NotPublisher.selector);
        registry.logAlert(
            CBETH_USD,
            CHAINLINK_VS_PYTH,
            int128(100),
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

    // ------------------------------------------------------------------
    // 2-step admin
    // ------------------------------------------------------------------

    function test_transferAdmin_twoStep_succeeds() public {
        vm.expectEmit(true, true, false, true, address(registry));
        emit AdminTransferInitiated(admin, publisher);
        vm.prank(admin);
        registry.transferAdmin(publisher);

        // admin unchanged until acceptAdmin is called
        assertEq(registry.admin(), admin);
        assertEq(registry.pendingAdmin(), publisher);

        vm.expectEmit(true, true, false, true, address(registry));
        emit AdminTransferred(admin, publisher);
        vm.prank(publisher);
        registry.acceptAdmin();

        assertEq(registry.admin(), publisher);
        assertEq(registry.pendingAdmin(), address(0));
    }

    function test_transferAdmin_revertsIfNotAdmin() public {
        vm.prank(stranger);
        vm.expectRevert(AlertRegistry.NotAdmin.selector);
        registry.transferAdmin(publisher);
    }

    function test_acceptAdmin_revertsIfNotPending() public {
        vm.prank(admin);
        registry.transferAdmin(publisher);

        vm.prank(stranger);
        vm.expectRevert(AlertRegistry.NotPendingAdmin.selector);
        registry.acceptAdmin();
    }

    function test_cancelAdminTransfer_clearsPending() public {
        vm.prank(admin);
        registry.transferAdmin(publisher);
        assertEq(registry.pendingAdmin(), publisher);

        vm.prank(admin);
        registry.cancelAdminTransfer();
        assertEq(registry.pendingAdmin(), address(0));
        assertEq(registry.admin(), admin);
    }

    function test_cancelAdminTransfer_revertsIfNotAdmin() public {
        vm.prank(admin);
        registry.transferAdmin(publisher);

        vm.prank(stranger);
        vm.expectRevert(AlertRegistry.NotAdmin.selector);
        registry.cancelAdminTransfer();
    }

    // ------------------------------------------------------------------
    // Loop fixture
    // ------------------------------------------------------------------

    function test_logAlert_loop_9Times() public {
        // Shape test: 9 sequential logAlert calls with varying deviation magnitudes
        // and unique evidence hashes all succeed, and each event matches its readback.
        // True Moonwell 9-incident replay (real dates + deviations from
        // .research/incident-forensics-moonwell.md) is deferred to D7 when the
        // incident data is locked in and the repo goes public.
        vm.startPrank(admin);
        for (uint256 i; i < 9; ++i) {
            int128 deviation = int128(int256(i)) * -1000;
            bytes32 evidence = keccak256(abi.encodePacked("incident-", i));

            vm.expectEmit(true, true, true, true, address(registry));
            emit AlertLogged(
                i,
                CBETH_USD,
                CHAINLINK_VS_PYTH,
                deviation,
                uint64(block.timestamp),
                evidence,
                uint32(0)
            );
            registry.logAlert(CBETH_USD, CHAINLINK_VS_PYTH, deviation, evidence, uint32(0));

            (, , bytes32 rEvidence, int128 rDev, , ) = registry.alerts(i);
            assertEq(rEvidence, evidence);
            assertEq(rDev, deviation);
        }
        vm.stopPrank();
        assertEq(registry.alertCount(), 9);
    }
}
