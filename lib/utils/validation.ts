
import { isAddress } from 'viem';

/**
 * Validates if a string is a valid Ethereum address.
 * @param address The string to validate.
 * @returns True if the address is valid, otherwise false.
 */
export function validateAddress(address: string): boolean {
  return isAddress(address);
}

interface AmountValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a token amount string against a maximum value.
 * @param amount The amount string to validate.
 * @param max The maximum allowed amount string (in the same unit, e.g., BLE).
 * @returns An object with a boolean `valid` and an optional `error` message.
 */
export function validateAmount(
  amount: string,
  max: string,
): AmountValidationResult {
  if (amount.trim() === '' || isNaN(Number(amount))) {
    return { valid: false, error: 'Please enter a valid number.' };
  }

  const amountNum = parseFloat(amount);
  const maxNum = parseFloat(max);

  if (amountNum <= 0) {
    return { valid: false, error: 'Amount must be greater than zero.' };
  }

  if (amountNum > maxNum) {
    return { valid: false, error: 'Insufficient balance.' };
  }

  return { valid: true };
}
