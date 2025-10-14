'use client';

import { useContract } from '@/hooks/useContract';
import { useAccount } from 'wagmi';

export function NetworkWarning() {
  const { isConnected } = useAccount();
  const { isSupported } = useContract();

  if (!isConnected || isSupported) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
      <p className="font-bold">Unsupported Network</p>
      <p>Please switch to a supported network (Base or Base Sepolia) to use this application.</p>
    </div>
  );
}
