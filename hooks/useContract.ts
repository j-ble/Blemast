import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import {
  BLEMAST_CONTRACT_ADDRESS_MAINNET,
  BLEMAST_CONTRACT_ADDRESS_SEPOLIA,
} from '@/lib/contracts/blemast';
import { type Address } from 'viem';

export function useContract() {
  const { chain } = useAccount();

  const address = useMemo((): Address | undefined => {
    if (chain?.id === baseSepolia.id) {
      return BLEMAST_CONTRACT_ADDRESS_SEPOLIA;
    }
    if (chain?.id === base.id) {
      return BLEMAST_CONTRACT_ADDRESS_MAINNET;
    }
    return undefined;
  }, [chain?.id]);

  const isSupported = address !== undefined;

  return { address, isSupported, chainId: chain?.id };
}