import Image from 'next/image';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { TransferForm } from '@/components/transfer/TransferForm';
import { NetworkWarning } from '@/components/network/NetworkWarning';
import { NetworkBadge } from '@/components/network/NetworkBadge';

/**
 * The main page of the Blemast token dashboard.
 * It includes the wallet connection and the primary token interaction components.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <Image
            src="/sphere.svg"
            alt="Blemast Logo"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-bold">Blemast</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NetworkBadge />
          <Wallet />
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <NetworkWarning />
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Token Dashboard
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Interact with the Blemast (BLE) ERC20 token.
            </p>
          </div>

          {/* This will be replaced by the DashboardGrid in Phase 2 */}
          <div className="w-full max-w-md mx-auto">
              <TransferForm />
          </div>
        </div>
      </main>

      <footer className="p-4 text-center border-t text-sm text-gray-500 bg-white">
        &copy; {new Date().getFullYear()} Blemast. All rights reserved.
      </footer>
    </div>
  );
}
