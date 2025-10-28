# Blemast Style Guide

> **Quick Reference for Visual Styling & Implementation**
>
> For comprehensive UX guidance, design principles, and dashboard best practices, see [design-principles.md](./design-principles.md).

## Purpose

This style guide documents the visual styling, component patterns, and code conventions for the Blemast project. Use this as a quick reference when implementing UI features to maintain consistency across the application.

---

## Brand & Visual Identity

### Logo
- **Asset**: `/public/sphere.svg`
- **Dimensions**: 200x200px
- **Description**: Animated radial gradient sphere with blue spectrum color cycling (5s loop)
- **Usage**: Primary brand mark on landing page and key touchpoints

### Brand Colors

The Blemast brand uses a **blue-to-purple spectrum** inspired by the sphere.svg logo, with a **dark-first modern Web3 aesthetic** (inspired by Sui.io):

**Primary Blues:**
- Electric Blue (Accent): `#4da6ff` - Primary interactive elements, CTAs, highlights
- Cyan: `#00ccff` - Secondary accents, hover states
- Medium Blue: `#0066cc` - Links, informational elements
- Royal Purple: `#6600cc` - Premium features, special callouts

**Supporting Blues:**
- Sky: `#0099ff` - Positive states, success indicators
- Deep: `#003366`, `#004080`, `#006699` - Backgrounds, cards, containers
- Midnight: `#000033`, `#000099`, `#3300cc` - Deep backgrounds, modals

**Dark-First UI Colors:**

| Element | Light Mode | Dark Mode (Default) |
|---------|------------|---------------------|
| Background (Primary) | `#ffffff` | `#011829` (Deep navy) |
| Background (Secondary) | `#f7f7f8` | `#0a0a0a` |
| Text (Primary) | `#171717` | `#F7F7F8` (Off-white) |
| Text (Secondary) | `#666666` | `rgba(247,247,248,0.7)` |
| Border | `#ccc` | `rgba(255,255,255,0.1)` |
| Border (Subtle) | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.05)` |
| Code Background | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` |
| Overlay/Glass | `rgba(255,255,255,0.9)` | `rgba(1,24,41,0.8)` |
| Accent Interactive | `#4da6ff` | `#4ea3ff` |

**Transparency & Depth:**
- Use `rgba()` values with 5-60% opacity for layering depth
- Glassmorphism overlays: 80-90% opacity backgrounds with subtle borders
- Card shadows: `box-shadow: 0 4px 16px rgba(0,0,0,0.1)` (light), `rgba(0,0,0,0.4)` (dark)

**Gradient Patterns:**
```css
/* Subtle border gradient */
background: linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05));

/* Accent gradient overlay */
background: linear-gradient(135deg, #4da6ff 0%, #6600cc 100%);
```

**Note**: Dark mode is the **primary design target**. Light mode available via system preference (`prefers-color-scheme: light`).

### Typography

**Font Families:**
- **Primary**: Inter (Google Fonts) - Use for all UI text, headings, and body copy
- **Monospace**: Source Code Pro (Google Fonts) - Use for code, addresses, hashes, and technical values

**Font Smoothing:**
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

**Current Font Sizes:**
- **Hero Title**: `clamp(2rem, 8vw, 80px)` - Responsive, scales 32px � 80px
- **Component Title**: Default size with `font-weight: 600`
- **Code/Technical**: `0.875rem` (14px)
- **Body**: 16px (browser default)

**Font Weights:**
- **Medium** (500): Hero titles
- **Semibold** (600): Section headings, component titles
- **Regular** (400): Body text (implied)

### Voice & Tone

**Principles:**
- **Clear & Direct**: Avoid jargon; explain Web3 concepts simply
- **Confident**: "Transfer tokens" not "Try to transfer tokens"
- **Helpful**: Provide context for actions ("Connect wallet to get started")
- **Technical when needed**: Use precise terminology for blockchain operations

**Copy Examples:**
-  "Connect Wallet"
- L "Please Connect Your Wallet to Continue"
-  "Transaction confirmed"
- L "Your transaction has been successfully confirmed!"

---

## Modern Web3 Design Aesthetic

### Design Philosophy (Inspired by Sui.io)

**Contemporary Web3 Visual Language:**
- **Minimalist Brutalism**: Clean lines, ample whitespace, purposeful typography
- **Technical Sophistication**: Code snippets, performance metrics, blockchain data
- **Glassmorphism**: Semi-transparent overlays with subtle borders
- **Motion Design**: Smooth transitions (0.5-2s duration) throughout
- **Enterprise Credibility**: Professional polish while maintaining developer approachability

### Depth & Layering

**Z-Index Hierarchy:**
```css
/* Base layers */
--z-base: 0;
--z-content: 1;
--z-card: 10;
--z-overlay: 100;
--z-modal: 1000;
--z-tooltip: 10000;
```

**Card Elevation:**
```css
/* Subtle elevation for cards */
.card-elevated {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Dark mode elevation */
@media (prefers-color-scheme: dark) {
  .card-elevated {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}
```

**Glassmorphism Patterns:**
```css
/* Glass card effect */
.glass-card {
  background: rgba(1, 24, 41, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

/* Light mode glass */
@media (prefers-color-scheme: light) {
  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}
```

### Animation & Interaction Patterns

**Timing Functions:**
- **Fast interactions**: 150-200ms (button hovers, focus states)
- **Standard transitions**: 300-500ms (menu opens, card reveals)
- **Smooth animations**: 500-1000ms (page transitions, carousels)
- **Ambient animations**: 2-5s (background gradients, logo animation)

**Standard Easing:**
```css
/* Smooth acceleration */
transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Bounce effect */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Micro-interactions:**
```css
/* Button hover effect */
.button-primary {
  transition: all 0.2s ease;
  transform: translateY(0);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(77, 166, 255, 0.4);
}

/* Link color shift */
.nav-link {
  color: #F7F7F8;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #4ea3ff;
}
```

**Loading States:**
```css
/* Skeleton loader */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 2s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Layout Patterns

**Grid System:**
```css
/* Responsive container */
.container-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Three-column feature cards */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Mobile-first breakpoints */
@media (max-width: 768px) {
  .container-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 1rem;
  }
}
```

**Section Spacing:**
```css
/* Vertical rhythm between sections */
.section {
  padding: 5rem 0;
}

.section-large {
  padding: 8rem 0;
}

.section-compact {
  padding: 3rem 0;
}

@media (max-width: 768px) {
  .section { padding: 3rem 0; }
  .section-large { padding: 4rem 0; }
  .section-compact { padding: 2rem 0; }
}
```

**Hero Layouts:**
```css
/* Full-width hero section */
.hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
}

/* Hero headline */
.hero-headline {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #4da6ff 0%, #6600cc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Component Specifications

### Buttons

**OnchainKit Transaction Button** (Primary action):
```tsx
<TransactionButton text="Transfer Tokens" />
```
- Styled by OnchainKit theme
- Use for all contract interactions
- Automatically handles wallet connection and transaction states

**Standard Button Styles** (when not using OnchainKit):
```css
button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
```

**States to consider:**
- Default
- Hover (subtle brightness/scale change)
- Active (pressed state)
- Disabled (reduced opacity, no pointer events)
- Loading (spinner or indeterminate state)

### Input Fields

**Text & Number Inputs:**
```css
input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Inter, sans-serif;
  font-size: 1rem;
  margin-bottom: 1rem;
}
```

**Address Inputs:**
- Use `placeholder="0x..."` to indicate format
- Consider using monospace font (Source Code Pro) for better readability
- Validate Ethereum address format (42 characters, starts with 0x)

**Token Amount Inputs:**
- Type: `number`
- Step: `0.000001` (or token's decimal precision)
- Placeholder: "0.00"
- Consider adding max balance helper

### Forms

**Container:**
```css
form {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: var(--background);
}
```

**Layout:**
- Stack inputs vertically with `1rem` spacing
- Labels above inputs (when used)
- Submit button at bottom
- Full-width inputs on mobile

**Validation:**
- Show errors below inputs in red text
- Use clear, actionable error messages
- Disable submit until form is valid

### Cards & Containers

**Standard Card:**
```css
.card {
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: var(--background);
}
```

**Spacing:**
- Internal padding: `1rem` to `1.5rem`
- Border radius: `8px` for containers, `4px` for small elements
- Bottom margin: `1rem` between stacked cards

### Code Blocks

**Inline Code:**
```css
code {
  font-family: var(--font-source-code-pro);
  font-size: 0.875rem;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.05); /* light mode */
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

**Code Block:**
```css
pre {
  font-family: var(--font-source-code-pro);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.05);
}
```

---

## Web3-Specific Patterns

### OnchainKit Configuration

**Provider Setup** (`app/rootProvider.tsx`):
```tsx
<OnchainKitProvider
  chain={base}
  config={{
    appearance: {
      mode: 'auto',  // Follows system preference
    },
    wallet: {
      display: 'modal',
      preference: 'all',
    },
  }}
>
```

**Wallet Button:**
```tsx
import { Wallet } from '@coinbase/onchainkit/wallet';

<Wallet />
```
- Handles connection automatically
- Shows connected address when connected
- Styled by OnchainKit theme

### Transaction Patterns

**Transaction Wrapper:**
```tsx
<Transaction
  contracts={contractsArray}
  onError={onError}
  onSuccess={onSuccess}
>
  <TransactionButton text="Action Name" />
  <TransactionStatus>
    <TransactionStatusLabel />
    <TransactionStatusAction />
  </TransactionStatus>
</Transaction>
```

**Transaction States to Handle:**
- **Idle**: Show action button
- **Pending**: Show loading state, disable interactions
- **Success**: Show success message with transaction link
- **Error**: Show error message with retry option

### Address Display

**Full Address** (when space allows):
```tsx
<code style={{ fontFamily: 'var(--font-source-code-pro)' }}>
  {address}
</code>
```

**Truncated Address** (for tight spaces):
```tsx
{`${address.slice(0, 6)}...${address.slice(-4)}`}
// Example: 0x1234...5678
```

**Formatting:**
- Always use monospace font (Source Code Pro)
- Lowercase preferred for consistency
- Link to block explorer (e.g., BaseScan) when clickable

### Token Amount Display

**User Input:**
```tsx
<input
  type="number"
  step="0.000001"
  placeholder="0.00"
  min="0"
/>
```

**Display Amount:**
```tsx
{amount.toLocaleString()} BLE
// Example: 1,000.50 BLE
```

**Formatting Guidelines:**
- Show 2-6 decimal places depending on context
- Use comma separators for thousands
- Always include token symbol (BLE)
- Consider showing USD equivalent (if price feed available)

### Contract Interactions

**Contract Definition** (`app/calls.ts`):
```tsx
export const contractBlemast = {
  address: '0x8B7a00F56e46B422f52f059478eb7E9B5167E907',
  abi: [...],
  chainId: baseSepolia.id,
} as const;
```

**Available Functions:**
- `transfer(address to, uint256 amount)` - Transfer tokens
- `approve(address spender, uint256 amount)` - Approve spending
- `mint(address to, uint256 amount)` - Mint new tokens (owner only)
- `burn(uint256 amount)` - Burn tokens
- `pause()` / `unpause()` - Pause transfers (owner only)

---

## Code Conventions

### CSS Architecture

**CSS Modules** (Preferred):
```tsx
// Component file
import styles from './page.module.css';

<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

**Global Styles** (`app/globals.css`):
- CSS reset (box-sizing, margin, padding)
- CSS custom properties (`:root` variables)
- Dark mode overrides (`@media (prefers-color-scheme: dark)`)
- Base element styles (html, body)

**Inline Styles** (Use Sparingly):
- Only for dynamic values (computed colors, positions)
- Avoid for static styling (use CSS Modules instead)
- Acceptable for one-off prototypes

### Naming Conventions

**CSS Classes** (camelCase for CSS Modules):
```css
.container { }
.mainTitle { }
.cardWrapper { }
.tokenAmount { }
```

**Component Files**:
- Page components: `page.tsx`
- Shared components: `PascalCase.tsx` (e.g., `TokenTransfer.tsx`)
- Style modules: `[component].module.css`

**Variables**:
```tsx
// Contract/blockchain data
const contractAddress = '0x...';
const tokenBalance = 1000;

// UI state
const isLoading = false;
const hasError = false;
```

### File Organization

```
app/
   layout.tsx              # Root layout with fonts
   rootProvider.tsx        # OnchainKit provider
   page.tsx               # Home page
   page.module.css        # Page-specific styles
   globals.css            # Global styles
   calls.ts               # Contract definitions
   [feature]/             # Feature-based directories
       page.tsx
       page.module.css

contracts/
   src/                   # Solidity contracts
   test/                  # Foundry tests

public/
   sphere.svg             # Brand logo
   [assets]/              # Images, fonts, static files
```

### Import Order

```tsx
// 1. External libraries
import React from 'react';
import { base } from 'wagmi/chains';

// 2. OnchainKit components
import { Wallet, Transaction } from '@coinbase/onchainkit';

// 3. Local components
import { TokenTransfer } from './TokenTransfer';

// 4. Utilities and contracts
import { contractBlemast } from './calls';

// 5. Styles
import styles from './page.module.css';
```

---

## Quick Reference

### Spacing Values in Use

| Element | Value |
|---------|-------|
| Header padding | `1rem` |
| Content padding bottom | `5vh` |
| Component title margin-top | `2rem` |
| Form container margin-top | `2rem` |
| Form container padding | `1rem` |
| Input margin-bottom | `1rem` |
| Components list margin-top | `0.75rem` |

**Note**: No formal spacing scale defined. Consider using multiples of 8px (0.5rem) for consistency.

### Border Radius

| Element | Value |
|---------|-------|
| Form container | `8px` |
| Card | `8px` |
| Input fields | `4px` |
| Code blocks | `6px` |
| Inline code | `3px` |

### Common Font Sizes

| Element | Value | Notes |
|---------|-------|-------|
| Hero title | `clamp(2rem, 8vw, 80px)` | Responsive |
| Body text | `1rem` (16px) | Default |
| Code | `0.875rem` (14px) | Monospace |

---

## Best Practices

### Accessibility
- Always provide `:focus` styles for keyboard navigation
- Use semantic HTML (`<button>`, `<input>`, `<form>`)
- Include `alt` text for images
- Ensure sufficient color contrast (WCAG AA minimum)
- Test with keyboard-only navigation

### Responsive Design
- Mobile-first approach
- Use `clamp()` for fluid typography
- Test on 320px (mobile), 768px (tablet), 1440px (desktop)
- Avoid horizontal scrolling
- Touch targets minimum 44x44px

### Performance
- Optimize images (WebP format, appropriate sizes)
- Lazy load images below the fold
- Minimize CSS bundle size (use CSS Modules, not global styles)
- Avoid layout shifts (reserve space for dynamic content)

### Web3 UX
- Always show transaction status (pending/success/error)
- Provide clear error messages ("Insufficient balance" not "Transaction failed")
- Link to block explorer for transaction details
- Show estimated gas fees when possible
- Allow users to cancel pending transactions

---

### Web3-Specific Modern Patterns

**Performance Metrics Display:**
```tsx
// Showcase blockchain stats prominently
<div className="stats-grid">
  <div className="stat-card">
    <span className="stat-value">297k</span>
    <span className="stat-label">TPS</span>
  </div>
  <div className="stat-card">
    <span className="stat-value">~400ms</span>
    <span className="stat-label">Finality</span>
  </div>
</div>
```

**Dual CTA Pattern:**
```css
/* Primary action (filled) + Secondary action (outline) */
.cta-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta-primary {
  background: #4da6ff;
  color: #fff;
  padding: 0.875rem 2rem;
  border-radius: 6px;
  font-weight: 600;
}

.cta-secondary {
  background: transparent;
  color: #4da6ff;
  border: 2px solid #4da6ff;
  padding: 0.875rem 2rem;
  border-radius: 6px;
  font-weight: 600;
}
```

**Carousel/Slider for Ecosystem Showcase:**
```tsx
// Use for news, ecosystem projects, events
import { Swiper, SwiperSlide } from 'swiper/react';

<Swiper
  slidesPerView={3}
  spaceBetween={24}
  navigation
  pagination={{ clickable: true }}
>
  {projects.map(project => (
    <SwiperSlide key={project.id}>
      <ProjectCard {...project} />
    </SwiperSlide>
  ))}
</Swiper>
```

**Company/Partner Logo Carousel:**
```css
/* Scrolling logo strip */
.logo-carousel {
  display: flex;
  gap: 3rem;
  padding: 2rem 0;
  overflow: hidden;
}

.logo-carousel img {
  height: 40px;
  opacity: 0.6;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.logo-carousel img:hover {
  opacity: 1;
  filter: grayscale(0%);
}
```

---

## Resources

- **Design Principles**: See [design-principles.md](./design-principles.md) for comprehensive UX guidance
- **Design Inspiration**: [Sui.io](https://sui.io/) - Modern Web3 design reference
- **OnchainKit Docs**: https://onchainkit.xyz
- **Base Chain Docs**: https://docs.base.org
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Figma/Design Files**: _[Add if available]_

**Key Design References:**
- Dark-first Web3 aesthetic with high contrast
- Glassmorphism and depth layering for modern feel
- Smooth micro-interactions (200-500ms transitions)
- Grid-based responsive layouts (320px - 1440px)
- Performance-focused: skeleton loaders, optimized animations
- Accessibility: WCAG AA minimum, keyboard navigation

---

**Last Updated**: 2025-10-28
**Design Philosophy**: Dark-first modern Web3 aesthetic inspired by Sui.io, maintaining Blemast's blue-purple brand spectrum
