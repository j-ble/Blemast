import { keccak256, toHex } from 'viem';

export const MINTER_ROLE = keccak256(toHex('MINTER_ROLE'));
export const PAUSER_ROLE = keccak256(toHex('PAUSER_ROLE'));

// This is a special case, it's the zero hash
export const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
