'use client';

import * as React from 'react';
import { type Address } from 'viem';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useContractStatus } from '@/hooks/useContractStatus';
import { useTransferToken } from '@/hooks/useTransferToken';
import { validateAddress, validateAmount } from '@/lib/utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function TransferForm() {
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [recipientError, setRecipientError] = React.useState('');
  const [amountError, setAmountError] = React.useState('');

  const { balance } = useTokenBalance();
  const { isPaused } = useContractStatus();
  const { transfer, isPending, isSuccess, error, txHash } = useTransferToken();

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
    if (recipientError) setRecipientError('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (amountError) setAmountError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isRecipientValid = validateAddress(recipient);
    if (!isRecipientValid) {
      setRecipientError('Please enter a valid Ethereum address.');
      return;
    }

    const amountValidation = validateAmount(amount, balance);
    if (!amountValidation.valid) {
      setAmountError(amountValidation.error || 'Invalid amount.');
      return;
    }

    transfer(recipient as Address, amount);
  };
  
  const handleMaxClick = () => {
    setAmount(balance);
    if (amountError) setAmountError('');
  };

  React.useEffect(() => {
    if (isSuccess) {
      setRecipient('');
      setAmount('');
    }
  }, [isSuccess]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer BLE Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="recipient">Recipient Address</label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={handleRecipientChange}
              required
            />
            {recipientError && <p className="text-sm text-destructive">{recipientError}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="amount">Amount (BLE)</label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                onClick={handleMaxClick}
              >
                Max
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Balance: {balance} BLE
            </p>
            {amountError && <p className="text-sm text-destructive">{amountError}</p>}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPaused || isPending}
            loading={isPending}
          >
            {isPaused ? 'Contract is Paused' : 'Transfer'}
          </Button>
        </form>

        {isSuccess && (
          <div className="mt-4 p-3 rounded-md bg-green-100 text-green-800">
            <p>Transfer successful!</p>
            {/* I will create a BaseScanLink component later */}
            <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">
              View on BaseScan
            </a>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-100 text-red-800">
            <p>Transaction failed: {error.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}