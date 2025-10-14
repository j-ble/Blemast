import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { blemastABI } from '@/lib/contracts/blemast';
import { useContract } from '@/hooks/useContract';
import { formatUnits } from 'viem';

export function useTokenBalance() {
  const { address: userAddress } = useAccount();
  const { address: contractAddress, isSupported } = useContract();

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: blemastABI,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: {
      enabled: !!userAddress && !!contractAddress && isSupported,
      refetchInterval: 10000, // Refresh every 10s
    },
  });

  // Format to human-readable BLE
  const balance = data ? formatUnits(data, 18) : '0';

  return { balance, balanceWei: data, isLoading, error, refetch };
}