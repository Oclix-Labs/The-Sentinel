import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ALERT_REGISTRY_ADDRESS =
  "0x79b5d74A301079c86D13eb71e2787852F403F876";

export const BASESCAN_MAINNET = `https://basescan.org/address/${ALERT_REGISTRY_ADDRESS}#code`;
export const BASESCAN_SEPOLIA = `https://sepolia.basescan.org/address/${ALERT_REGISTRY_ADDRESS}#code`;
export const GITHUB_REPO = "https://github.com/Oclix-Labs/The-Sentinel";

export function shortenAddress(addr: string, chars = 6): string {
  return `${addr.slice(0, chars)}…${addr.slice(-chars)}`;
}
