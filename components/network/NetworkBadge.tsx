'use client';

import { useAccount } from 'wagmi';
import { getNetworkConfig } from '@/constants/networks';
import { Badge } from '@/components/ui/Badge';

export function NetworkBadge() {
  const { chain } = useAccount();
  const networkConfig = getNetworkConfig(chain?.id);

  if (!chain || !networkConfig) {
    return <Badge variant="destructive">Unsupported Network</Badge>;
  }

  return <Badge variant="outline">{networkConfig.name}</Badge>;
}
