import { base, baseSepolia } from 'wagmi/chains';

interface NetworkConfig {
  id: number;
  name: string;
  explorerUrl: string;
}

export const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  [base.id]: {
    id: base.id,
    name: 'Base',
    explorerUrl: 'https://basescan.org',
  },
  [baseSepolia.id]: {
    id: baseSepolia.id,
    name: 'Base Sepolia',
    explorerUrl: 'https://sepolia.basescan.org',
  },
};

export const getNetworkConfig = (chainId: number | undefined) => {
  if (!chainId) return null;
  return SUPPORTED_NETWORKS[chainId];
};
