import type { OracleSource } from './types';

export interface AssetConfig {
  symbol: string;
  /** Deviation threshold in basis points. Any pairwise deviation above this triggers an alert. */
  thresholdBps: number;
  /** Oracles that have feeds (push or pull) for this asset on Base mainnet. */
  oracles: readonly OracleSource[];
  /** Chainlink AggregatorV3 proxy on Base Mainnet. Required if oracles includes 'chainlink'. */
  chainlinkFeed?: `0x${string}`;
  /** Pyth Hermes feed ID (64-hex, no 0x prefix). Required if oracles includes 'pyth'. */
  pythFeedId?: string;
  /** RedStone REST symbol. Required if oracles includes 'redstone'. */
  redstoneSymbol?: string;
}

/**
 * Phase-1 asset coverage. Feed addresses verified against
 * .research/oracle-inventory-base.md §2.1 (Chainlink), §3.2 (Pyth sponsored push),
 * §4.1 (RedStone push). When adding assets, update that research file first.
 */
export const PHASE_1_ASSETS: readonly AssetConfig[] = [
  {
    symbol: 'BTC/USD',
    thresholdBps: 50,
    oracles: ['chainlink', 'pyth', 'redstone'],
    chainlinkFeed: '0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F',
    pythFeedId: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    redstoneSymbol: 'BTC',
  },
  {
    symbol: 'ETH/USD',
    thresholdBps: 50,
    oracles: ['chainlink', 'pyth', 'redstone'],
    chainlinkFeed: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
    pythFeedId: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    redstoneSymbol: 'ETH',
  },
  {
    symbol: 'USDC/USD',
    thresholdBps: 20,
    oracles: ['chainlink', 'pyth', 'redstone'],
    chainlinkFeed: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
    pythFeedId: 'eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
    redstoneSymbol: 'USDC',
  },
  {
    symbol: 'cbETH/USD',
    thresholdBps: 50,
    // RedStone has no cbETH push feed on Base (research §4.1). Pull-only not used in Phase 1.
    oracles: ['chainlink', 'pyth'],
    chainlinkFeed: '0xd7818272B9e248357d13057AAb0B417aF31E817d',
    pythFeedId: '15ecddd26d49e1a8f1de9376ebebc03916ede873447c1255d2d5891b92ce5717',
  },
];
