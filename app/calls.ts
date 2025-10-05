// Blemast Token Contract Integration
const blemastContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x8B7a00F56e46B422f52f059478eb7E9B5167E907';

const blemastContractAbi = [
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'burn',
    inputs: [{ name: 'value', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
] as const;

// Example: Transfer tokens
export const transferTokensCalls = (to: string, amount: string) => [
  {
    address: blemastContractAddress as `0x${string}`,
    abi: blemastContractAbi,
    functionName: 'transfer',
    args: [to as `0x${string}`, BigInt(amount)],
  },
];

// Example: Mint tokens (owner only)
export const mintTokensCalls = (to: string, amount: string) => [
  {
    address: blemastContractAddress as `0x${string}`,
    abi: blemastContractAbi,
    functionName: 'mint',
    args: [to as `0x${string}`, BigInt(amount)],
  },
];

// Example: Burn tokens
export const burnTokensCalls = (amount: string) => [
  {
    address: blemastContractAddress as `0x${string}`,
    abi: blemastContractAbi,
    functionName: 'burn',
    args: [BigInt(amount)],
  },
];

export { blemastContractAddress, blemastContractAbi };
