import { useCallback, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import { blemastABI } from '@/lib/contracts/blemast';
import { useContract } from './useContract';
import { useTokenBalance } from './useTokenBalance';

export function useTransferToken() {
  const { address: contractAddress } = useContract();
  const { refetch: refetchBalance } = useTokenBalance();

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer = useCallback(
    (to: Address, amount: string) => {
      if (!contractAddress) {
        console.error('Contract address not found');
        return;
      }
      const amountWei = parseUnits(amount, 18);

      writeContract({
        address: contractAddress,
        abi: blemastABI,
        functionName: 'transfer',
        args: [to, amountWei],
      });
    },
    [contractAddress, writeContract]
  );

  // Refetch balance on success
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
    }
  }, [isSuccess, refetchBalance]);

  return {
    transfer,
    txHash: hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
  };
}