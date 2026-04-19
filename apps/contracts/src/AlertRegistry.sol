// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AlertRegistry — append-only public log of cross-oracle deviations.
/// @notice Off-chain poller detects deviation > threshold and calls `logAlert`.
///         Anyone can read historical alerts without trusting our backend.
/// @dev Phase 1 MVP. Access control restricted to authorized publisher addresses
///      (set by DEFAULT_ADMIN_ROLE). Phase 2 adds multi-operator consensus.
contract AlertRegistry {
    // ------------------------------------------------------------------
    // Roles
    // ------------------------------------------------------------------

    /// @notice Addresses permitted to call `logAlert`.
    /// @dev Phase 1: Oclix Labs operator address. Phase 2: set of federated operators.
    mapping(address => bool) public isPublisher;

    address public admin;

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------

    struct Alert {
        bytes32 asset;            // asset identifier, e.g. keccak256("cbETH/USD")
        bytes32 oraclePair;       // oracle pair identifier, e.g. keccak256("chainlink_vs_pyth")
        int256  deviationBps;     // signed deviation in basis points (10000 = 100%)
        uint64  blockTimestamp;   // unix seconds at detection
        bytes32 evidenceHash;     // hash of off-chain evidence payload (feed values, tx hashes)
        uint32  alertType;        // reserved (0 = price-cross-check, 1 = attestation-expiry)
    }

    Alert[] public alerts;

    // ------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------

    event AlertLogged(
        uint256 indexed alertId,
        bytes32 indexed asset,
        bytes32 indexed oraclePair,
        int256 deviationBps,
        uint64 blockTimestamp,
        bytes32 evidenceHash,
        uint32 alertType
    );

    event PublisherSet(address indexed publisher, bool allowed);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    // ------------------------------------------------------------------
    // Errors
    // ------------------------------------------------------------------

    error NotAdmin();
    error NotPublisher();

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
        int256 deviationBps,
        bytes32 evidenceHash,
        uint32 alertType
    ) external returns (uint256 alertId) {
        if (!isPublisher[msg.sender]) revert NotPublisher();

        alertId = alerts.length;
        alerts.push(
            Alert({
                asset: asset,
                oraclePair: oraclePair,
                deviationBps: deviationBps,
                blockTimestamp: uint64(block.timestamp),
                evidenceHash: evidenceHash,
                alertType: alertType
            })
        );

        emit AlertLogged(
            alertId,
            asset,
            oraclePair,
            deviationBps,
            uint64(block.timestamp),
            evidenceHash,
            alertType
        );
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

    function transferAdmin(address newAdmin) external {
        if (msg.sender != admin) revert NotAdmin();
        emit AdminTransferred(admin, newAdmin);
        admin = newAdmin;
    }
}
