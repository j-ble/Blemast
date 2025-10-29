"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function AirDrop() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [walletAddresses, setWalletAddresses] = useState("");
  const [amounts, setAmounts] = useState("");
  const [totalRecipients, setTotalRecipients] = useState(0);

  const handleWalletAddressesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setWalletAddresses(value);
    const lines = value.split('\n').filter(line => line.trim());
    setTotalRecipients(lines.length);
  };

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.headerWrapper}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/sphere.svg"
            alt="Blemast Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.brandName}>Blemast</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/transfer" className={styles.navButton}>
            Transfer
          </Link>
          <Link href="/airdrop" className={styles.navButton}>
            AirDrop
          </Link>
        </nav>

        <Wallet />
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Token Airdrop</h1>
          <p className={styles.subtitle}>
            Distribute ERC20 tokens to multiple recipients efficiently. Enter addresses and amounts below.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Airdrop Info Card */}
        <div className={styles.transferCard}>
          <h2 className={styles.cardTitle}>Batch Token Distribution</h2>

          {/* Token Address Input */}
          <div className={styles.inputGroup}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              color: 'var(--foreground-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              ERC20 Token Contract Address
            </label>
            <input
              type="text"
              placeholder="0x... (e.g., BLE Token on Base Sepolia)"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className={styles.input}
            />
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--foreground-secondary)',
              marginTop: 'var(--space-2)'
            }}>
              Enter the ERC20 token contract address you want to airdrop
            </p>
          </div>

          {/* Wallet Addresses Input */}
          <div className={styles.inputGroup}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              color: 'var(--foreground-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              Recipient Addresses (one per line)
            </label>
            <textarea
              placeholder="0x123...&#10;0x456...&#10;0x789..."
              value={walletAddresses}
              onChange={handleWalletAddressesChange}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: 'var(--space-3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontFamily: 'var(--font-source-code-pro), monospace',
                fontSize: '0.875rem',
                background: 'var(--background-secondary)',
                color: 'var(--foreground)',
                resize: 'vertical',
                transition: 'all 0.2s ease'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--foreground-secondary)',
              marginTop: 'var(--space-2)'
            }}>
              Enter one wallet address per line
            </p>
          </div>

          {/* Amounts Input */}
          <div className={styles.inputGroup}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--space-2)',
              color: 'var(--foreground-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              Amounts in Wei (one per line)
            </label>
            <textarea
              placeholder="1000000000000000000&#10;2000000000000000000&#10;3000000000000000000"
              value={amounts}
              onChange={(e) => setAmounts(e.target.value)}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: 'var(--space-3)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontFamily: 'var(--font-source-code-pro), monospace',
                fontSize: '0.875rem',
                background: 'var(--background-secondary)',
                color: 'var(--foreground)',
                resize: 'vertical',
                transition: 'all 0.2s ease'
              }}
            />
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--foreground-secondary)',
              marginTop: 'var(--space-2)'
            }}>
              Enter amounts in wei - must match the order of addresses above. 1 token = 1,000,000,000,000,000,000 wei (18 decimals)
            </p>
          </div>

          {totalRecipients > 0 && (
            <div style={{
              padding: 'var(--space-4)',
              background: 'rgba(77, 166, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid var(--accent-blue)',
              marginBottom: 'var(--space-4)'
            }}>
              <p style={{ color: 'var(--accent-blue)', fontWeight: 500 }}>
                Ready to distribute to {totalRecipients} recipients
              </p>
            </div>
          )}

          <div style={{
            padding: 'var(--space-4)',
            background: 'rgba(255, 193, 7, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 193, 7, 0.5)',
            marginTop: 'var(--space-4)'
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
              <strong>Coming Soon:</strong> Batch transfer functionality is currently under development.
              This feature will allow you to efficiently distribute tokens to multiple addresses in a single transaction.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className={styles.componentsSection}>
          <h2 className={styles.componentsTitle}>Planned Features</h2>

          <ul className={styles.components}>
            {[
              { name: "Batch Transfer" },
              { name: "Merkle Airdrop" },
              { name: "Vesting Schedule" },
              { name: "Claim Portal" },
              { name: "Airdrop History" },
            ].map((feature) => (
              <li key={feature.name}>
                <div className={styles.componentLink} style={{ cursor: 'default' }}>
                  {feature.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
