import { type Address, formatUnits, parseUnits } from 'viem';

/**
 * Formats a WEI bigint value into a human-readable BLE token string.
 * @param wei The amount in WEI (bigint).
 * @returns A formatted string like "1,234.56 BLE".
 */
export function formatBLE(wei: bigint): string {
  const ble = formatUnits(wei, 18);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(ble));
  return `${formatted} BLE`;
}

/**
 * Parses a BLE token string into a WEI bigint value.
 * @param ble The human-readable BLE amount string.
 * @returns The amount in WEI (bigint).
 */
export function parseBLE(ble: string): bigint {
  // Remove any commas
  const sanitizedBle = ble.replace(/,/g, '');
  return parseUnits(sanitizedBle as `${number}`, 18);
}

/**
 * Formats an Ethereum address into a shortened version (e.g., "0x123...abc").
 * @param address The full address.
 * @returns The shortened address string.
 */
export function formatAddress(address: Address): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formats a UNIX timestamp (in seconds) into a relative time string (e.g., "5 minutes ago").
 * @param timestamp The timestamp in seconds (bigint).
 * @returns A relative time string.
 */
export function formatTimestamp(timestamp: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const secondsAgo = now - Number(timestamp);

  if (secondsAgo < 60) {
    const value = Math.round(secondsAgo);
    return `${value} second${value === 1 ? '' : 's'} ago`;
  }
  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(secondsAgo / 86400);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}