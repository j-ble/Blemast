/**
 * Formats a duration in seconds into a countdown string (e.g., "23h 45m 12s").
 * @param seconds The duration in seconds (bigint).
 * @returns A formatted countdown string.
 */
export function formatCountdown(seconds: bigint): string {
  const totalSeconds = Number(seconds);

  if (totalSeconds <= 0) {
    return "0s";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  let result = '';
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  if (secs > 0 || result === '') {
    result += `${secs}s`;
  }

  return result.trim();
}

/**
 * Formats a UNIX timestamp (in seconds) into a full date and time string.
 * @param timestamp The timestamp in seconds (bigint).
 * @returns A formatted date string (e.g., "Jan 15, 2025 at 3:45 PM").
 */
export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}
