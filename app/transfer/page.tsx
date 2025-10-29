"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from "@coinbase/onchainkit/transaction";
import { transferTokensCalls } from "../calls";

export default function Transfer() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

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
          <h1 className={styles.title}>Transfer BLE Tokens</h1>
          <p className={styles.subtitle}>
            Send Blemast tokens to any address on the Base Sepolia network. Simple, fast, and secure.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Transfer Card */}
        <div className={styles.transferCard}>
          <h2 className={styles.cardTitle}>Send Tokens</h2>

          <div className={styles.inputGroup}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--foreground-secondary)', fontSize: '0.875rem' }}>
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--foreground-secondary)', fontSize: '0.875rem' }}>
              Amount (in wei)
            </label>
            <input
              type="text"
              placeholder="1000000000000000000 = 1 BLE"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--foreground-secondary)', marginTop: 'var(--space-2)' }}>
              1 BLE = 1,000,000,000,000,000,000 wei (18 decimals)
            </p>
          </div>

          <Transaction
            calls={transferTokensCalls(recipientAddress, amount || "0")}
            chainId={84532}
          >
            <TransactionButton text="Transfer Tokens" />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </div>
      </div>
    </div>
  );
}
