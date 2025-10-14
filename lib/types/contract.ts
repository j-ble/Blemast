import { type Address } from 'viem';

export interface TransferEvent {
  from: Address;
  to: Address;
  value: bigint;
}

export interface ApprovalEvent {
  owner: Address;
  spender: Address;
  value: bigint;
}

export interface RoleGrantedEvent {
  role: `0x${string}`;
  account: Address;
  sender: Address;
}

export interface RoleRevokedEvent {
  role: `0x${string}`;
  account: Address;
  sender: Address;
}

export interface ContractPausedEvent {
  account: Address;
}

export interface ContractUnpausedEvent {
  account: Address;
}
