# Frontend & AirDrop Implementation Documentation

**Date Created:** 2025-10-28
**Last Updated:** 2025-10-28
**Project:** Blemast Token Airdrop UI

---

## Table of Contents

1. [Overview](#overview)
2. [Design System Updates](#design-system-updates)
3. [Navigation & Routing](#navigation--routing)
4. [Page Structure](#page-structure)
5. [Airdrop Functionality](#airdrop-functionality)
6. [Technical Implementation](#technical-implementation)
7. [Future Enhancements](#future-enhancements)

---

## Overview

This document covers the complete frontend refactor of the Blemast token application, implementing a modern dark-first Web3 aesthetic inspired by Sui.io. The application now features a static site architecture with dedicated pages for token transfers and airdrops.

### Key Features Implemented

- **Dark-First Design**: Modern Web3 aesthetic with glassmorphism and depth layering
- **Three-Page Architecture**: Landing page, Transfer page, and Airdrop page
- **Navigation System**: Persistent header with navigation buttons
- **Airdrop Interface**: Clean three-input form for batch token distribution
- **Responsive Design**: Mobile-first approach (320px - 1440px)

---

## Design System Updates

### Color Palette (Inspired by Sui.io)

**Brand Colors:**
```css
--accent-blue: #4da6ff        /* Primary interactive elements */
--accent-cyan: #00ccff        /* Secondary accents, hover states */
--accent-purple: #6600cc      /* Premium features */
--accent-medium: #0066cc      /* Links, informational */
--accent-sky: #0099ff         /* Success indicators */
```

**Dark-First UI Colors:**
```css
/* Dark Mode (Primary/Default) */
--background: #011829          /* Deep navy - main background */
--background-secondary: #0a0a0a
--foreground: #F7F7F8          /* Off-white text */
--foreground-secondary: rgba(247, 247, 248, 0.7)
--border: rgba(255, 255, 255, 0.1)
--border-subtle: rgba(255, 255, 255, 0.05)
--overlay: rgba(1, 24, 41, 0.8) /* Glassmorphism */
```

**Light Mode (Secondary):**
```css
--background: #ffffff
--background-secondary: #f7f7f8
--foreground: #171717
--foreground-secondary: #666666
--border: rgba(0, 0, 0, 0.1)
```

### Typography

**Font Families:**
- **Primary**: Inter (Google Fonts) - All UI text, headings, body copy
- **Monospace**: Source Code Pro (Google Fonts) - Addresses, hashes, technical values

**Font Smoothing:**
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Spacing Scale

Based on 8px base unit:
```css
--space-1: 0.25rem  /* 4px */
--space-2: 0.5rem   /* 8px */
--space-3: 0.75rem  /* 12px */
--space-4: 1rem     /* 16px */
--space-6: 1.5rem   /* 24px */
--space-8: 2rem     /* 32px */
--space-12: 3rem    /* 48px */
--space-16: 4rem    /* 64px */
--space-20: 5rem    /* 80px */
```

### Glassmorphism & Depth

**Card Elevation:**
```css
.card-elevated {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .card-elevated {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }
}

.card-elevated:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(77, 166, 255, 0.2);
}
```

**Glass Card Effect:**
```css
.glass-card {
  background: var(--overlay);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
}
```

### Animation & Transitions

**Timing:**
- **Fast interactions**: 150-200ms (button hovers, focus states)
- **Standard transitions**: 300-500ms (menu opens, card reveals)
- **Smooth animations**: 500-1000ms (page transitions)
- **Ambient animations**: 2-5s (background gradients, logo)

**Easing Functions:**
```css
/* Smooth acceleration */
transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Bounce effect */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## Navigation & Routing

### Header Component

**Structure:**
```
Header (Sticky)
├── Logo Container (Left) → Link to home
│   ├── Sphere.svg (40x40px, animated float)
│   └── "Blemast" text
├── Navigation (Center)
│   ├── "Transfer" button → /transfer
│   └── "AirDrop" button → /airdrop
└── Wallet Connect (Right) → OnchainKit Wallet
```

**Styling:**
```css
.headerWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-8);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--background);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: var(--z-overlay);
}
```

**Navigation Buttons:**
```css
.navButton {
  padding: var(--space-2) var(--space-4);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.navButton:hover {
  background: var(--overlay);
  border-color: var(--accent-blue);
  color: var(--accent-blue);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(77, 166, 255, 0.15);
}
```

### Routing Structure

```
/                    → Home (Landing Page)
/transfer            → Token Transfer Page
/airdrop             → Token Airdrop Page
```

---

## Page Structure

### 1. Home Page (/)

**Purpose:** Landing page with hero section and CTAs

**Components:**
- Sticky header with navigation
- Hero section with:
  - Animated sphere logo (120x120px)
  - Gradient title: "Build Beyond with Blemast"
  - Subtitle describing the project
  - Two CTA buttons:
    - **"Get Started"** (Primary) → /transfer
    - **"Learn More"** (Secondary) → /airdrop

**CTA Button Styles:**
```css
/* Primary CTA */
.ctaPrimary {
  background: var(--accent-blue);
  color: #fff;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid var(--accent-blue);
}

.ctaPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(77, 166, 255, 0.4);
  background: var(--accent-cyan);
}

/* Secondary CTA */
.ctaSecondary {
  background: transparent;
  color: var(--accent-blue);
  border: 2px solid var(--accent-blue);
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
}

.ctaSecondary:hover {
  background: var(--accent-blue);
  color: #fff;
  transform: translateY(-2px);
}
```

### 2. Transfer Page (/transfer)

**Purpose:** Single token transfer functionality

**Components:**
- Sticky header with navigation
- Hero section with title "Transfer BLE Tokens"
- Transfer card with:
  - Recipient address input (single-line)
  - Amount input in wei (single-line)
  - OnchainKit Transaction button
  - Transaction status display

**Input Fields:**
```tsx
<div className={styles.inputGroup}>
  <label>Recipient Address</label>
  <input
    type="text"
    placeholder="0x..."
    value={recipientAddress}
    onChange={(e) => setRecipientAddress(e.target.value)}
    className={styles.input}
  />
</div>

<div className={styles.inputGroup}>
  <label>Amount (in wei)</label>
  <input
    type="text"
    placeholder="1000000000000000000 = 1 BLE"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    className={styles.input}
  />
  <p>1 BLE = 1,000,000,000,000,000,000 wei (18 decimals)</p>
</div>
```

### 3. Airdrop Page (/airdrop)

**Purpose:** Batch token distribution interface

**See detailed section below:** [Airdrop Functionality](#airdrop-functionality)

---

## Airdrop Functionality

### Overview

The airdrop page allows users to distribute any ERC20 token to multiple recipients in a batch. The interface consists of three input fields that work together to define the airdrop parameters.

### Three-Input Structure

#### 1. Token Address Input

**Purpose:** Specify which ERC20 token to airdrop

```tsx
<div className={styles.inputGroup}>
  <label>ERC20 Token Contract Address</label>
  <input
    type="text"
    placeholder="0x... (e.g., BLE Token on Base Sepolia)"
    value={tokenAddress}
    onChange={(e) => setTokenAddress(e.target.value)}
    className={styles.input}
  />
  <p>Enter the ERC20 token contract address you want to airdrop</p>
</div>
```

**Details:**
- Single-line text input
- Accepts any valid ERC20 contract address
- Users can airdrop their own tokens (not limited to BLE)
- Example: BLE Token: `0x7E7AC4CC49d0587A566b5D4f07391ea64243EB30`

#### 2. Recipient Addresses Input

**Purpose:** List of wallet addresses to receive tokens

```tsx
<div className={styles.inputGroup}>
  <label>Recipient Addresses (one per line)</label>
  <textarea
    placeholder="0x123...
0x456...
0x789..."
    value={walletAddresses}
    onChange={handleWalletAddressesChange}
    style={{
      width: '100%',
      minHeight: '150px',
      fontFamily: 'var(--font-source-code-pro), monospace',
      fontSize: '0.875rem',
      background: 'var(--background-secondary)',
      color: 'var(--foreground)',
      resize: 'vertical'
    }}
  />
  <p>Enter one wallet address per line</p>
</div>
```

**Details:**
- Multi-line textarea with monospace font
- One address per line
- Automatically counts recipients
- Updates `totalRecipients` state on change

**Handler Function:**
```tsx
const handleWalletAddressesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setWalletAddresses(value);
  const lines = value.split('\n').filter(line => line.trim());
  setTotalRecipients(lines.length);
};
```

#### 3. Amounts Input

**Purpose:** Corresponding amounts in wei for each recipient

```tsx
<div className={styles.inputGroup}>
  <label>Amounts in Wei (one per line)</label>
  <textarea
    placeholder="1000000000000000000
2000000000000000000
3000000000000000000"
    value={amounts}
    onChange={(e) => setAmounts(e.target.value)}
    style={{
      width: '100%',
      minHeight: '150px',
      fontFamily: 'var(--font-source-code-pro), monospace',
      fontSize: '0.875rem',
      background: 'var(--background-secondary)',
      color: 'var(--foreground)',
      resize: 'vertical'
    }}
  />
  <p>Enter amounts in wei - must match the order of addresses above.
     1 token = 1,000,000,000,000,000,000 wei (18 decimals)</p>
</div>
```

**Details:**
- Multi-line textarea with monospace font
- One amount per line (in wei)
- **Line correlation**: First amount → First address, Second amount → Second address, etc.
- Helper text explains wei conversion

### State Management

```tsx
const [tokenAddress, setTokenAddress] = useState("");
const [walletAddresses, setWalletAddresses] = useState("");
const [amounts, setAmounts] = useState("");
const [totalRecipients, setTotalRecipients] = useState(0);
```

### Recipient Counter

When addresses are entered, displays a status box:

```tsx
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
```

### Coming Soon Notice

UI-only implementation (no smart contract integration yet):

```tsx
<div style={{
  padding: 'var(--space-4)',
  background: 'rgba(255, 193, 7, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 193, 7, 0.5)',
  marginTop: 'var(--space-4)'
}}>
  <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.6 }}>
    <strong>Coming Soon:</strong> Batch transfer functionality is currently under development.
    This feature will allow you to efficiently distribute tokens to multiple addresses
    in a single transaction.
  </p>
</div>
```

### Planned Features Section

Displays future functionality:

```tsx
<div className={styles.componentsSection}>
  <h2>Planned Features</h2>
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
```

---

## Technical Implementation

### File Structure

```
app/
├── page.tsx                 # Home page (landing)
├── page.module.css          # Shared styles for all pages
├── globals.css              # Global styles, design tokens
├── calls.ts                 # Contract interaction functions
├── transfer/
│   └── page.tsx            # Transfer page
└── airdrop/
    └── page.tsx            # Airdrop page

context/
├── setup.md                # Token Airdropper setup plan
├── style-guide.md          # Visual styling reference
├── design-principles.md    # S-Tier dashboard checklist
└── frontendAirDrop.md      # This file
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "15.3.4",
    "@coinbase/onchainkit": "^0.x.x",
    "wagmi": "^2.x.x",
    "viem": "^2.x.x",
    "react": "^18.x.x"
  }
}
```

### Design Tokens (globals.css)

Located in `app/globals.css`:

```css
@layer base {
  :root {
    /* Light mode variables */
    --background: #ffffff;
    --background-secondary: #f7f7f8;
    --foreground: #171717;
    --foreground-secondary: #666666;
    --border: rgba(0, 0, 0, 0.1);
    --border-subtle: rgba(0, 0, 0, 0.05);
    --overlay: rgba(255, 255, 255, 0.9);

    /* Brand colors */
    --accent-blue: #4da6ff;
    --accent-cyan: #00ccff;
    --accent-purple: #6600cc;
    --accent-medium: #0066cc;
    --accent-sky: #0099ff;

    /* Z-index hierarchy */
    --z-base: 0;
    --z-content: 1;
    --z-card: 10;
    --z-overlay: 100;
    --z-modal: 1000;
    --z-tooltip: 10000;

    /* Spacing scale */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      /* Dark mode overrides */
      --background: #011829;
      --background-secondary: #0a0a0a;
      --foreground: #F7F7F8;
      --foreground-secondary: rgba(247, 247, 248, 0.7);
      --border: rgba(255, 255, 255, 0.1);
      --border-subtle: rgba(255, 255, 255, 0.05);
      --overlay: rgba(1, 24, 41, 0.8);
      --accent-blue: #4ea3ff;
    }
  }
}
```

### Utility Classes

```css
/* Glassmorphism */
.glass-card {
  background: var(--overlay);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
}

/* Card elevation */
.card-elevated {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-subtle);
  transition: all 0.3s ease;
}

.card-elevated:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(77, 166, 255, 0.2);
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
```

### Responsive Design

Mobile-first breakpoints:

```css
/* Mobile: 320px - 768px (default) */
/* Tablet: 768px - 1024px */
@media (max-width: 768px) {
  .headerWrapper {
    padding: var(--space-3) var(--space-4);
  }

  .nav {
    gap: var(--space-2);
  }

  .navButton {
    padding: var(--space-2) var(--space-3);
    font-size: 0.875rem;
  }

  .hero {
    min-height: 70vh;
    padding: var(--space-12) var(--space-4);
  }

  .title {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  .ctaContainer {
    flex-direction: column;
    width: 100%;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container-grid {
    max-width: 1440px;
    margin: 0 auto;
  }
}
```

---

## Future Enhancements

### Phase 1: Smart Contract Integration

**Implement Batch Transfer:**
1. Create `AirdropManager.sol` contract
2. Implement `batchTransfer` function:
   ```solidity
   function batchTransfer(
       IERC20 token,
       address[] calldata recipients,
       uint256[] calldata amounts
   ) external onlyOwner
   ```
3. Add approval flow for token spending
4. Integrate with OnchainKit Transaction components

**Frontend Integration:**
```tsx
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';

const airdropCalls = (tokenAddress, recipients, amounts) => [
  {
    to: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [AIRDROP_MANAGER_ADDRESS, totalAmount],
  },
  {
    to: AIRDROP_MANAGER_ADDRESS,
    abi: AIRDROP_MANAGER_ABI,
    functionName: 'batchTransfer',
    args: [tokenAddress, recipients, amounts],
  },
];

<Transaction calls={airdropCalls(tokenAddress, recipientsArray, amountsArray)}>
  <TransactionButton text="Execute Airdrop" />
  <TransactionStatus>
    <TransactionStatusLabel />
    <TransactionStatusAction />
  </TransactionStatus>
</Transaction>
```

### Phase 2: Merkle Airdrop

**For Large-Scale Airdrops:**
1. Off-chain merkle tree generation
2. On-chain merkle root storage
3. Users claim with merkle proof
4. Lowest gas cost for owner

**Implementation Plan:**
- Use OpenZeppelin's MerkleProof library
- Generate merkle tree from recipient list
- Store root on-chain
- Provide claim interface for recipients

### Phase 3: Vesting Schedules

**Features:**
- Time-locked token releases
- Cliff periods
- Linear vesting curves
- Recipient claim portal

### Phase 4: Enhanced UX

**Additions:**
- CSV import/export functionality
- Address validation with visual feedback
- Amount calculator (token → wei converter)
- Transaction history table
- Airdrop analytics dashboard
- Social verification (Twitter/Discord)
- Sybil resistance mechanisms

### Phase 5: Multi-Chain Support

**Expand Beyond Base:**
- Ethereum mainnet
- Polygon
- Arbitrum
- Optimism
- Multi-chain wallet detection

---

## Development Commands

### Frontend

```bash
# Start dev server
npm run dev          # http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

### Smart Contracts (Future)

```bash
# Deploy AirdropManager
forge create contracts/src/AirdropManager.sol:AirdropManager \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer \
  --broadcast

# Run tests
forge test

# Test coverage
forge coverage --report lcov
```

---

## Environment Variables

Required in `.env`:

```bash
# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=xxx

# Base Sepolia
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BLE Token Contract
COUNTER_CONTRACT_ADDRESS=0x7E7AC4CC49d0587A566b5D4f07391ea64243EB30

# Future: Airdrop Manager (when deployed)
# AIRDROP_MANAGER_ADDRESS=0x...
```

---

## Testing Checklist

### Manual Testing

**Home Page:**
- [ ] Logo animation works
- [ ] Navigation buttons link correctly
- [ ] Wallet connect button functions
- [ ] CTA buttons navigate to correct pages
- [ ] Responsive design works (mobile/tablet/desktop)

**Transfer Page:**
- [ ] Input fields accept valid data
- [ ] Transaction button integrates with wallet
- [ ] Status updates display correctly
- [ ] Error handling works

**Airdrop Page:**
- [ ] All three inputs accept data
- [ ] Recipient counter updates correctly
- [ ] Line correlation is clear (addresses match amounts)
- [ ] Monospace font displays addresses/amounts clearly
- [ ] "Coming Soon" notice is visible

**Cross-Browser:**
- [ ] Chrome/Brave
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Design References

- **Sui.io**: https://sui.io/ (Primary design inspiration)
- **OnchainKit**: https://onchainkit.xyz (Component library)
- **Base Docs**: https://docs.base.org (Chain documentation)
- **Style Guide**: `/context/style-guide.md` (Internal reference)
- **Design Principles**: `/context/design-principles.md` (S-Tier checklist)

---

## Changelog

### 2025-10-28 - Initial Implementation

**Added:**
- Dark-first Web3 design system inspired by Sui.io
- Three-page architecture (home, transfer, airdrop)
- Navigation system with header buttons
- Glassmorphism and depth layering
- Airdrop page with three-input structure
- Responsive design (320px - 1440px)
- Design tokens and utility classes

**Removed:**
- Transfer functionality from home page
- CSV upload from airdrop page
- "How to Use" instructions box

**Changed:**
- Home page to landing page with CTAs
- Airdrop interface to three separate inputs
- Color scheme to dark-first (deep navy background)
- Typography to Inter + Source Code Pro

---

## Contributors

- **Development**: Claude Code
- **Design Inspiration**: Sui.io
- **Token Contract**: Blemast (BLE) on Base Sepolia
- **Framework**: Next.js 15 + OnchainKit

---

## License

This documentation is part of the Blemast project.

---

**End of Document**
