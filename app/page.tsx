"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from "@coinbase/onchainkit/transaction";
import { transferTokensCalls } from "./calls";

export default function Home() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.headerWrapper}>
        <div className={styles.logoContainer}>
          <Image
            src="/sphere.svg"
            alt="Blemast Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.brandName}>Blemast</span>
        </div>
        <Wallet />
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Image
            priority
            src="/sphere.svg"
            alt="Blemast Sphere"
            width={120}
            height={120}
            style={{ marginBottom: '2rem' }}
          />
          <h1 className={styles.title}>Build Beyond with Blemast</h1>
          <p className={styles.subtitle}>
            A modern ERC20 token on Base chain. Transfer, manage, and interact with BLE tokens seamlessly on Base Sepolia testnet.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className={styles.content}>
        {/* Transfer Card */}
        <div className={styles.transferCard}>
          <h2 className={styles.cardTitle}>Transfer BLE Tokens</h2>

          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Recipient Address (0x...)"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Amount (in wei, e.g., 1000000000000000000 = 1 BLE)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
            />
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

        {/* Components Section */}
        <div className={styles.componentsSection}>
          <h2 className={styles.componentsTitle}>Explore OnchainKit Components</h2>

          <ul className={styles.components}>
            {[
              {
                name: "Transaction",
                url: "https://docs.base.org/onchainkit/transaction/transaction",
              },
              {
                name: "Swap",
                url: "https://docs.base.org/onchainkit/swap/swap",
              },
              {
                name: "Checkout",
                url: "https://docs.base.org/onchainkit/checkout/checkout",
              },
              {
                name: "Wallet",
                url: "https://docs.base.org/onchainkit/wallet/wallet",
              },
              {
                name: "Identity",
                url: "https://docs.base.org/onchainkit/identity/identity",
              },
            ].map((component) => (
              <li key={component.name}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={component.url}
                  className={styles.componentLink}
                >
                  {component.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
