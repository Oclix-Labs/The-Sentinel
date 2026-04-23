// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AlertRegistry — append-only public log of cross-oracle deviations.
/// @notice Off-chain poller detects deviation > threshold and calls `logAlert`.
///         Anyone can read historical alerts without trusting our backend.
/// @dev Phase 1 MVP. Access control restricted to authorized publisher addresses
///      (managed by `admin`, see docs/DECISIONS/0006-custom-access-control.md).
///      Phase 2 adds multi-operator consensus.
contract AlertRegistry {
    // ------------------------------------------------------------------
    // Roles
    // ------------------------------------------------------------------

    /// @notice Addresses permitted to call `logAlert`.
    /// @dev Phase 1: Oclix Labs operator address. Phase 2: set of federated operators.
    mapping(address => bool) public isPublisher;

    address public admin;
    address public pendingAdmin;

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------

    /// @dev Packed into 4 storage slots:
    ///      slot 0: asset
    ///      slot 1: oraclePair
    ///      slot 2: evidenceHash
    ///      slot 3: deviationBps (16B) + blockTimestamp (8B) + alertType (4B) = 28B used
    struct Alert {
        bytes32 asset;            // slot 0 — keccak256 asset id, e.g. "cbETH/USD"
        bytes32 oraclePair;       // slot 1 — keccak256 pair id, e.g. "chainlink_vs_pyth"
        bytes32 evidenceHash;     // slot 2 — hash of off-chain evidence payload
        int128  deviationBps;     // slot 3 (16B) — signed deviation in bps (10000 = 100%)
        uint64  blockTimestamp;   // slot 3 ( 8B) — L2 block time at logAlert tx
        uint32  alertType;        // slot 3 ( 4B) — 0 = price-cross-check, 1 = attestation-expiry
    }

    Alert[] public alerts;

    // ------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------

    event AlertLogged(
        uint256 indexed alertId,
        bytes32 indexed asset,
        bytes32 indexed oraclePair,
        int128 deviationBps,
        uint64 blockTimestamp,
        bytes32 evidenceHash,
        uint32 alertType
    );

    event PublisherSet(address indexed publisher, bool allowed);
    event AdminTransferInitiated(address indexed currentAdmin, address indexed pendingAdmin);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    // ------------------------------------------------------------------
    // Errors
    // ------------------------------------------------------------------

    error NotAdmin();
    error NotPublisher();
    error NotPendingAdmin();

    // ------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------

    constructor(address _admin) {
        admin = _admin;
        isPublisher[_admin] = true;
        emit PublisherSet(_admin, true);
        emit AdminTransferred(address(0), _admin);
    }

    // ------------------------------------------------------------------
    // Public — logAlert
    // ------------------------------------------------------------------

    /// @notice Append a new alert to the public log. Called by off-chain poller
    ///         when an oracle deviation crosses the configured threshold.
    function logAlert(
        bytes32 asset,
        bytes32 oraclePair,
        int128 deviationBps,
        bytes32 evidenceHash,
        uint32 alertType
    ) external returns (uint256 alertId) {
        if (!isPublisher[msg.sender]) revert NotPublisher();

        alertId = alerts.length;
        uint64 ts = uint64(block.timestamp);
        alerts.push(
            Alert({
                asset: asset,
                oraclePair: oraclePair,
                evidenceHash: evidenceHash,
                deviationBps: deviationBps,
                blockTimestamp: ts,
                alertType: alertType
            })
        );

        emit AlertLogged(alertId, asset, oraclePair, deviationBps, ts, evidenceHash, alertType);
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    function alertCount() external view returns (uint256) {
        return alerts.length;
    }

    // ------------------------------------------------------------------
    // Admin
    // ------------------------------------------------------------------

    function setPublisher(address publisher, bool allowed) external {
        if (msg.sender != admin) revert NotAdmin();
        isPublisher[publisher] = allowed;
        emit PublisherSet(publisher, allowed);
    }

    /// @notice Step 1 of 2-step admin rotation. Records the pending admin; the
    ///         transfer is not effective until `acceptAdmin` is called by newAdmin.
    /// @dev    Guards against typo'd addresses — the new admin must prove key custody.
    ///         Pattern mirrors OpenZeppelin `Ownable2Step`.
    function transferAdmin(address newAdmin) external {
        if (msg.sender != admin) revert NotAdmin();
        pendingAdmin = newAdmin;
        emit AdminTransferInitiated(admin, newAdmin);
    }

    /// @notice Step 2 of 2-step admin rotation. Must be called from the pending admin
    ///         address; only then does `admin` change.
    function acceptAdmin() external {
        if (msg.sender != pendingAdmin) revert NotPendingAdmin();
        address oldAdmin = admin;
        admin = pendingAdmin;
        delete pendingAdmin;
        emit AdminTransferred(oldAdmin, msg.sender);
    }

    /// @notice Abort an in-progress admin transfer. Only the current admin can cancel.
    function cancelAdminTransfer() external {
        if (msg.sender != admin) revert NotAdmin();
        delete pendingAdmin;
    }
}
