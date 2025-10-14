import { useReadContract } from 'wagmi';
import { blemastABI } from '@/lib/contracts/blemast';
import { useContract } from '@/hooks/useContract';

export function useContractStatus() {
  const { address: contractAddress, isSupported } = useContract();

  const { data: isPaused, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: blemastABI,
    functionName: 'paused',
    query: {
      enabled: !!contractAddress && isSupported,
      refetchInterval: 15000, // Refresh every 15s
    },
  });

  return { isPaused, isLoading, error, refetch };
}
