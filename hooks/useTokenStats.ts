import { useReadContracts } from 'wagmi';
import { blemastABI, MAX_SUPPLY } from '@/lib/contracts/blemast';
import { useContract } from '@/hooks/useContract';

export function useTokenStats() {
  const { address: contractAddress, isSupported } = useContract();

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: blemastABI,
        functionName: 'totalSupply',
      },
      {
        address: contractAddress,
        abi: blemastABI,
        functionName: 'MAX_SUPPLY',
      },
    ],
    query: {
      enabled: !!contractAddress && isSupported,
      refetchInterval: 30000, // Refresh every 30s
    },
  });

  const [totalSupplyData, maxSupplyData] = data || [];

  return {
    totalSupply: totalSupplyData?.result,
    // Fallback to constant if the contract call is pending or fails
    maxSupply: maxSupplyData?.result ?? MAX_SUPPLY,
    isLoading,
    error,
    refetch,
  };
}