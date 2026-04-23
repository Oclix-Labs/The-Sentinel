import type { PublicClient } from 'viem';
import type { OraclePrice } from '../types';

// Subset of PublicClient required here. Picking a single method sidesteps chain-specific
// generic incompatibilities (e.g. Base's OP-stack deposit tx formatter widens getBlock).
type ReadClient = Pick<PublicClient, 'readContract'>;

const AGGREGATOR_V3_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { name: 'roundId', type: 'uint80' },
      { name: 'answer', type: 'int256' },
      { name: 'startedAt', type: 'uint256' },
      { name: 'updatedAt', type: 'uint256' },
      { name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Read the latest round from a Chainlink AggregatorV3 proxy on Base Mainnet.
 * Assumes 8 decimals — true for every USD pair in Phase-1 scope per
 * .research/oracle-inventory-base.md §2.1. If a feed with different decimals is ever
 * added, compute priceE18 from a dynamic decimals() read.
 */
export async function fetchChainlinkPrice(
  client: ReadClient,
  asset: string,
  feed: `0x${string}`,
): Promise<OraclePrice> {
  const [roundId, answer, , updatedAt] = await client.readContract({
    address: feed,
    abi: AGGREGATOR_V3_ABI,
    functionName: 'latestRoundData',
  });

  if (answer <= 0n) {
    throw new Error(`chainlink ${asset} (${feed}) non-positive answer: ${answer}`);
  }
  // 8 decimals → 18 decimals: multiply by 1e10.
  const priceE18 = answer * 10n ** 10n;

  return {
    asset,
    source: 'chainlink',
    priceE18,
    updatedAt: Number(updatedAt),
    meta: { roundId: roundId.toString(), feed },
  };
}
