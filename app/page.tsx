"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function Home() {
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

          <div className={styles.ctaContainer}>
            <Link href="/transfer" className={styles.ctaPrimary}>
              Get Started
            </Link>
            <Link href="/airdrop" className={styles.ctaSecondary}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
