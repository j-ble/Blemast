# Blemast Token Frontend - Comprehensive Implementation Plan

## Executive Summary

This plan outlines a production-ready Next.js 15 frontend for the Blemast (BLE) ERC20 token, leveraging OnchainKit, wagmi, and viem for web3 integration. The architecture emphasizes role-based access control, real-time data synchronization, accessibility compliance, and comprehensive testing.

---

## 1. Current State Analysis

### Existing Frontend
- **Framework:** Next.js 15 with OnchainKit integration
- **Wallet Connection:** Basic Wallet component from OnchainKit
- **Current Features:** Simple token transfer UI (app/page.tsx:33-72)
- **Network Config:** Configured for Base mainnet (need testnet support)
- **Dependencies:** @coinbase/onchainkit, wagmi, viem, @tanstack/react-query

### Current Issues
- ❌ Transfer UI uses wei input (poor UX - needs BLE token conversion)
- ❌ Contract ABI is incomplete (missing role functions, view functions)
- ❌ No role checking (minter/pauser/admin features not exposed)
- ❌ No contract statistics dashboard
- ❌ No event history or transaction tracking
- ❌ Hardcoded to mainnet (need testnet support)

### Blemast Contract Details (contracts/src/Blemast.sol)

**Token Information:**
- Name: "Blemast"
- Symbol: "BLE"
- Decimals: 18
- Max Supply: 1,000,000,000 BLE (1 billion)
- Initial Supply: 100,000,000 BLE (100 million, 10%)
- Deployed on Base Sepolia: `0x8B7a00F56e46B422f52f059478eb7E9B5167E907`

**Core Features:**
1. **Standard ERC20:** transfer, approve, balanceOf, totalSupply, allowance
2. **Burnable:** Token holders can burn their own tokens
3. **Pausable:** PAUSER_ROLE can pause/unpause all transfers
4. **Permit (EIP-2612):** Gasless approvals via signatures
5. **Role-based Access Control:**
   - `DEFAULT_ADMIN_ROLE`: Can grant/revoke all roles (hash: 0x00...00)
   - `MINTER_ROLE`: Can mint tokens with rate limits (hash: keccak256("MINTER_ROLE"))
   - `PAUSER_ROLE`: Can pause/unpause transfers (hash: keccak256("PAUSER_ROLE"))
6. **Rate Limiting:**
   - Max 100,000 BLE per 24-hour period
   - Cooldown: 1 day (86400 seconds)

---

## 2. Component Architecture

### File Structure

```
app/
├── page.tsx                          # Main dashboard (refactored)
├── layout.tsx                        # Root layout
├── rootProvider.tsx                  # OnchainKit provider
├── globals.css                       # Global styles
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Brand, network badge, wallet
│   │   ├── HeroSection.tsx          # Token branding and quick stats
│   │   └── Footer.tsx               # Links and copyright
│   │
│   ├── dashboard/
│   │   ├── DashboardGrid.tsx        # Responsive grid container
│   │   ├── TokenStats.tsx           # Total/max supply, status
│   │   ├── UserBalance.tsx          # User's balance card
│   │   └── MintingStatus.tsx        # Rate limit info
│   │
│   ├── transfer/
│   │   └── TransferForm.tsx         # Token transfer interface
│   │
│   ├── burn/
│   │   └── BurnForm.tsx             # Token burn interface
│   │
│   ├── mint/
│   │   └── MintForm.tsx             # Minting interface (role-gated)
│   │
│   ├── pause/
│   │   └── PauseControls.tsx        # Pause/unpause (role-gated)
│   │
│   ├── roles/
│   │   ├── RoleManager.tsx          # Role grant/revoke (role-gated)
│   │   └── RoleHoldersList.tsx      # Display current role holders
│   │
│   ├── activity/
│   │   ├── ActivityFeed.tsx         # Event history
│   │   └── ActivityItem.tsx         # Single event item
│   │
│   ├── network/
│   │   ├── NetworkBadge.tsx         # Current network indicator
│   │   └── NetworkWarning.tsx       # Wrong network warning
│   │
│   └── ui/                          # Reusable primitives
│       ├── Card.tsx                 # Container component
│       ├── Button.tsx               # Styled button
│       ├── Input.tsx                # Form input with validation
│       ├── Badge.tsx                # Status badges
│       ├── ProgressBar.tsx          # Progress visualization
│       ├── Modal.tsx                # Confirmation dialogs
│       ├── Alert.tsx                # Notifications
│       ├── Tabs.tsx                 # Tab navigation
│       ├── Countdown.tsx            # Real-time countdown
│       ├── Skeleton.tsx             # Loading placeholder
│       └── Spinner.tsx              # Loading spinner
│
├── hooks/
│   ├── useContract.ts               # Contract address by network
│   ├── useTokenBalance.ts           # User's BLE balance
│   ├── useTokenStats.ts             # Total supply, max supply, etc.
│   ├── useMintingStatus.ts          # Available mint amount, time
│   ├── useContractStatus.ts         # Paused status
│   ├── useUserRoles.ts              # Check user's roles
│   ├── useRoleHolders.ts            # Fetch role holders from events
│   ├── useTransferToken.ts          # Token transfer hook
│   ├── useMintToken.ts              # Minting hook
│   ├── useBurnToken.ts              # Burn hook
│   ├── usePauseContract.ts          # Pause/unpause hooks
│   ├── useGrantRole.ts              # Grant role hook
│   ├── useRevokeRole.ts             # Revoke role hook
│   └── useActivityFeed.ts           # Fetch and parse events
│
├── lib/
│   ├── contracts/
│   │   ├── blemast.ts               # Complete ABI, addresses, constants
│   │   └── roleConstants.ts         # Role hashes
│   │
│   ├── utils/
│   │   ├── format.ts                # Token formatting (wei ↔ BLE)
│   │   ├── validation.ts            # Address, amount validation
│   │   └── time.ts                  # Time formatting utilities
│   │
│   └── types/
│       └── contract.ts              # TypeScript types for contract
│
└── constants/
    └── networks.ts                  # Network configs, explorers
```

---

## 3. Implementation Roadmap

### Phase 1: Foundation (Week 1) - CRITICAL PRIORITY

**Goal:** Establish core infrastructure and fix existing issues.

**Tasks:**

1. **Contract Integration** ⭐ CRITICAL
   - [ ] Create `lib/contracts/blemast.ts` with complete ABI
     - Export full ABI (all functions, events)
     - Export contract addresses (Sepolia: `0x8B7a00F56e46B422f52f059478eb7E9B5167E907`, Mainnet: TBD)
     - Export role constants (MINTER_ROLE, PAUSER_ROLE, DEFAULT_ADMIN_ROLE)
     - Export numeric constants (MAX_SUPPLY, MAX_MINT_PER_PERIOD, MINT_COOLDOWN)
   - [ ] Create `lib/contracts/roleConstants.ts`
     - Define role hashes: `export const MINTER_ROLE = keccak256(toHex('MINTER_ROLE'))`
   - [ ] Create `lib/types/contract.ts`
     - TypeScript interfaces for contract data
     - Event types, error types

2. **Utility Functions** ⭐ CRITICAL
   - [ ] `lib/utils/format.ts`
     - `formatBLE(wei: bigint): string` - Convert wei to "1,234.56 BLE"
     - `parseBLE(ble: string): bigint` - Convert "1234.56" to wei
     - `formatAddress(address: Address): string` - "0x123...abc"
     - `formatTimestamp(timestamp: bigint): string` - Relative time
   - [ ] `lib/utils/validation.ts`
     - `validateAddress(address: string): boolean`
     - `validateAmount(amount: string, max: string): { valid: boolean, error?: string }`
   - [ ] `lib/utils/time.ts`
     - `formatCountdown(seconds: bigint): string` - "23h 45m 12s"
     - `formatDate(timestamp: bigint): string` - "Jan 15, 2025 at 3:45 PM"

3. **Core Hooks** ⭐ CRITICAL
   - [ ] `hooks/useContract.ts` - Contract address resolver
   - [ ] `hooks/useTokenBalance.ts` - User's BLE balance
   - [ ] `hooks/useTokenStats.ts` - Total/max supply
   - [ ] `hooks/useContractStatus.ts` - Paused status

4. **Network Handling** 🔶 HIGH
   - [ ] `components/network/NetworkBadge.tsx` - Display current network
   - [ ] `components/network/NetworkWarning.tsx` - Wrong network banner
   - [ ] `constants/networks.ts` - Network configs, explorer URLs

5. **UI Primitives** 🔶 HIGH
   - [ ] `components/ui/Card.tsx` - Reusable card component
   - [ ] `components/ui/Button.tsx` - Styled button with variants
   - [ ] `components/ui/Input.tsx` - Form input with validation
   - [ ] `components/ui/Badge.tsx` - Status badges
   - [ ] `components/ui/Spinner.tsx` - Loading spinner
   - [ ] `components/ui/Skeleton.tsx` - Loading skeleton

6. **Refactor Transfer UI** 🔶 HIGH
   - [ ] Rewrite `app/page.tsx` transfer section
   - [ ] Use `useTransferToken()` hook
   - [ ] Convert wei input to BLE input
   - [ ] Add validation and error handling
   - [ ] Add "Max" button
   - [ ] Show transaction status

**Deliverables:**
- ✅ Complete contract ABI and constants
- ✅ Working network detection and switching
- ✅ Refactored transfer UI with BLE formatting
- ✅ Reusable UI components library
- ✅ Utility functions for formatting and validation
- ✅ 80%+ test coverage

**Testing:**
- Unit tests for utility functions (format, validation, time)
- Component tests for UI primitives (Button, Input, Card)
- Integration test: Transfer tokens on Base Sepolia testnet

---

### Phase 2: Dashboard (Week 2) - HIGH PRIORITY

**Goal:** Build information display components for transparency.

**Tasks:**

1. **Dashboard Components** 🔶 HIGH
   - [ ] `components/dashboard/DashboardGrid.tsx` - Responsive grid layout
   - [ ] `components/dashboard/TokenStats.tsx` - Total/max supply card
     - Implement with `useTokenStats()`
     - Add progress bar visualization
     - Show contract status badge
   - [ ] `components/dashboard/UserBalance.tsx` - User balance card
     - Implement with `useTokenBalance()`
     - Add quick action buttons
     - Handle disconnected state
   - [ ] `components/dashboard/MintingStatus.tsx` - Rate limit card
     - Implement with `useMintingStatus()`
     - Add countdown timer component
     - Add progress bar for period usage

2. **Additional UI Components** 🔷 MEDIUM
   - [ ] `components/ui/ProgressBar.tsx` - Visual progress indicator
   - [ ] `components/ui/Countdown.tsx` - Real-time countdown timer
   - [ ] `components/ui/Alert.tsx` - Alert/notification component

3. **Page Layout** 🔶 HIGH
   - [ ] `components/layout/HeroSection.tsx` - Hero banner
   - [ ] Refactor `app/page.tsx` to use dashboard components
   - [ ] Implement responsive grid (3 columns → 1 column on mobile)

**Deliverables:**
- ✅ Three dashboard cards (Token Stats, User Balance, Minting Status)
- ✅ Real-time data display with auto-refresh
- ✅ Responsive layout
- ✅ Professional design with Tailwind CSS

**Testing:**
- Component tests for each dashboard card
- Test loading states (skeletons)
- Test error states
- Test data refresh on network events
- E2E test: Dashboard displays correct data

---

### Phase 3: Core Features (Week 3) - HIGH PRIORITY

**Goal:** Implement write operations (transfer, burn).

**Tasks:**

1. **Transfer Feature** 🔶 HIGH
   - [ ] `hooks/useTransferToken.ts` - Transfer hook
   - [ ] `components/transfer/TransferForm.tsx` - Complete transfer UI
     - Form validation (address, amount)
     - Balance checking
     - Pause status checking
     - Transaction status display
     - Error handling

2. **Burn Feature** 🔶 HIGH
   - [ ] `hooks/useBurnToken.ts` - Burn hook
   - [ ] `components/burn/BurnForm.tsx` - Burn UI
     - Amount input with validation
     - Confirmation modal
     - Impact preview ("New balance: X BLE")
     - Transaction status

3. **UI Components** 🔶 HIGH
   - [ ] `components/ui/Modal.tsx` - Confirmation dialog
   - [ ] `components/ui/TransactionStatus.tsx` - Tx status display (use OnchainKit)
   - [ ] `components/ui/BaseScanLink.tsx` - Link to block explorer

4. **Error Handling** 🔷 MEDIUM
   - [ ] Global error boundary
   - [ ] Toast notification system (consider react-hot-toast)
   - [ ] User-friendly error messages

**Deliverables:**
- ✅ Working transfer interface with validation
- ✅ Working burn interface with confirmation
- ✅ Transaction status feedback
- ✅ Error handling and success notifications
- ✅ 85%+ test coverage

**Testing:**
- Unit tests for hooks (useTransferToken, useBurnToken)
- Component tests for forms (validation logic)
- Integration tests with mock contract
- E2E tests:
  - Transfer tokens successfully
  - Burn tokens successfully
  - Handle insufficient balance error
  - Handle rejected transaction

---

### Phase 4: Role-Based Features (Week 4) - MEDIUM PRIORITY

**Goal:** Implement role-gated features (minting, pausing).

**Tasks:**

1. **Role Checking** 🔶 HIGH
   - [ ] `hooks/useUserRoles.ts` - Role checking hook
     - Query hasRole for MINTER_ROLE
     - Query hasRole for PAUSER_ROLE
     - Query hasRole for DEFAULT_ADMIN_ROLE
   - [ ] `components/ui/InfoCard.tsx` - "Role required" message component

2. **Minting Feature** 🔶 HIGH
   - [ ] `hooks/useMintingStatus.ts` - Rate limit data
   - [ ] `hooks/useMintToken.ts` - Mint transaction hook
   - [ ] `components/mint/MintForm.tsx` - Mint UI
     - Role gate (conditional render)
     - Rate limit display
     - Amount validation (check available, max supply)
     - Error parsing (MintRateLimitExceeded)
     - Transaction status

3. **Pause Controls** 🔶 HIGH
   - [ ] `hooks/usePauseContract.ts` - Pause/unpause hooks
   - [ ] `components/pause/PauseControls.tsx` - Pause UI
     - Role gate
     - Status indicator (large badge)
     - Pause/unpause buttons
     - Confirmation dialog with warning
     - Real-time event listening (ContractPaused/Unpaused)

4. **Tab Navigation** 🔷 MEDIUM
   - [ ] `components/ui/Tabs.tsx` - Tab component
   - [ ] Refactor `app/page.tsx` to use tabs for features
     - Tab 1: Transfer
     - Tab 2: Burn
     - Tab 3: Mint (conditional)
     - Tab 4: Pause (conditional)

**Deliverables:**
- ✅ Role-based conditional rendering
- ✅ Working mint interface with rate limit validation
- ✅ Working pause controls
- ✅ Tab-based navigation for features

**Testing:**
- Test role checking logic (useUserRoles hook)
- Test conditional rendering (show/hide based on roles)
- Test mint validation (rate limits, max supply)
- Test pause/unpause functionality
- E2E tests:
  - Mint tokens as MINTER_ROLE holder
  - Pause contract as PAUSER_ROLE holder
  - Verify transfers fail when paused
  - Verify non-role holders see "role required" message

---

### Phase 5: Admin Features (Week 5) - MEDIUM PRIORITY

**Goal:** Implement role management (grant/revoke).

**Tasks:**

1. **Role Management** 🔷 MEDIUM
   - [ ] `hooks/useGrantRole.ts` - Grant role hook
   - [ ] `hooks/useRevokeRole.ts` - Revoke role hook
   - [ ] `hooks/useRoleHolders.ts` - Fetch role holders from events
   - [ ] `components/roles/RoleManager.tsx` - Role management UI
     - Role gate (DEFAULT_ADMIN_ROLE only)
     - Grant role section (dropdown + address input)
     - Revoke role section (dropdown + address input)
     - Validation (address format, check if already has/lacks role)
     - Warning for admin role changes
     - Transaction status

2. **Role Holders Display** 🔷 MEDIUM
   - [ ] `components/roles/RoleHoldersList.tsx` - Display current role holders
     - Accordion: Minters, Pausers, Admins
     - Address list with copy button
     - ENS name resolution (optional)
     - BaseScan links
   - [ ] `components/ui/Accordion.tsx` - Accordion component
   - [ ] `components/ui/AddressList.tsx` - Address list component

3. **Admin Tab** 🔷 MEDIUM
   - [ ] Add "Admin" tab to main page
   - [ ] Integrate RoleManager and RoleHoldersList

**Deliverables:**
- ✅ Role grant/revoke functionality
- ✅ Display of current role holders
- ✅ Admin-only interface

**Testing:**
- Test role grant/revoke transactions
- Test role holder fetching from events
- Test conditional rendering (admin-only)
- E2E tests:
  - Grant MINTER_ROLE to address
  - Verify address appears in role holders list
  - Revoke MINTER_ROLE
  - Verify address removed from list
  - Test as non-admin (should see "role required" message)

---

### Phase 6: Activity & Polish (Week 6) - MEDIUM PRIORITY

**Goal:** Add transparency (event history) and polish UX.

**Tasks:**

1. **Activity Feed** 🔷 MEDIUM
   - [ ] `hooks/useActivityFeed.ts` - Fetch and parse events
     - Fetch Transfer, Minted, ContractPaused, ContractUnpaused, RoleGranted, RoleRevoked events
     - Parse event logs
     - Format for display
     - Implement filtering
   - [ ] `components/activity/ActivityFeed.tsx` - Activity feed UI
     - List of events (chronological)
     - Filter bar (event type, user-only toggle)
     - Pagination or infinite scroll
     - Loading states
   - [ ] `components/activity/ActivityItem.tsx` - Single event display
     - Event icon
     - Description
     - Timestamp (relative)
     - Transaction hash link

2. **Loading States** 🔷 MEDIUM
   - [ ] Skeleton loaders for all data components
   - [ ] Spinner for transaction pending states
   - [ ] Progress indicators

3. **Responsive Design** 🔶 HIGH
   - [ ] Test all components on mobile (375px width)
   - [ ] Stack dashboard cards on mobile
   - [ ] Adjust form layouts for small screens
   - [ ] Test tab navigation on mobile

4. **Accessibility** 🔶 HIGH
   - [ ] Add ARIA labels to all interactive elements
   - [ ] Test keyboard navigation
   - [ ] Test with screen reader (VoiceOver/NVDA)
   - [ ] Ensure color contrast (WCAG AA)
   - [ ] Add skip links
   - [ ] Test focus management in modals

5. **Polish** 🔵 LOW
   - [ ] Animations (fade in/out, slide transitions)
   - [ ] Success confetti animation (optional)
   - [ ] Empty states for all components
   - [ ] 404 page
   - [ ] Footer with links

**Deliverables:**
- ✅ Complete activity feed with event history
- ✅ Responsive design for mobile devices
- ✅ Full accessibility compliance (WCAG 2.1 AA)
- ✅ Polished UI with loading states and animations
- ✅ 90%+ test coverage

**Testing:**
- Test activity feed filtering
- Test event parsing logic
- Test mobile responsiveness (Playwright viewport testing)
- Accessibility tests:
  - Run axe-core on all pages
  - Test keyboard navigation
  - Test screen reader compatibility
- Visual regression tests (Playwright snapshots)

---

### Phase 7: Advanced Features (Week 7+) - FUTURE ENHANCEMENTS

**Goal:** Optional enhancements for future iterations.

**Tasks:**

1. **EIP-2612 Permit** 🔵 LOW
   - [ ] `hooks/usePermit.ts` - Permit signing hook
   - [ ] `components/permit/PermitForm.tsx` - Permit UI
   - [ ] Documentation for developers

2. **Price Integration** 🔵 LOW
   - [ ] Integrate price feed (if BLE has market price)
   - [ ] Display USD values in dashboard
   - [ ] Price chart

3. **Analytics Dashboard** 🔵 LOW
   - [ ] Token holder distribution
   - [ ] Transfer volume over time
   - [ ] Mint rate over time

4. **Notifications** 🔵 LOW
   - [ ] Real-time toast notifications for events
   - [ ] Optional email/push notifications for role holders

**Note:** These features are deferred to future releases. Focus on Phases 1-6 for MVP.

---

## 4. Technical Implementation Details

### 4.1 Hook Implementation Examples

#### `useContract.ts` - Contract Address Resolver
```typescript
export function useContract() {
  const { chain } = useAccount()

  const address = useMemo(() => {
    if (chain?.id === baseSepolia.id) {
      return process.env.NEXT_PUBLIC_BLEMAST_SEPOLIA_ADDRESS as Address
    }
    if (chain?.id === base.id) {
      return process.env.NEXT_PUBLIC_BLEMAST_MAINNET_ADDRESS as Address
    }
    return undefined
  }, [chain?.id])

  const isSupported = address !== undefined

  return { address, isSupported, chainId: chain?.id }
}
```

#### `useTokenBalance.ts` - User's BLE Balance
```typescript
export function useTokenBalance() {
  const { address: userAddress } = useAccount()
  const { address: contractAddress } = useContract()

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: blemastABI,
    functionName: 'balanceOf',
    args: [userAddress!],
    query: {
      enabled: !!userAddress && !!contractAddress,
      refetchInterval: 10000, // Refresh every 10s
    }
  })

  // Format to human-readable BLE
  const balance = data ? formatUnits(data, 18) : '0'

  return { balance, balanceWei: data, isLoading, error, refetch }
}
```

#### `useUserRoles.ts` - Role Checking
```typescript
export function useUserRoles() {
  const { address: userAddress } = useAccount()
  const { address: contractAddress } = useContract()

  const minterQuery = useReadContract({
    address: contractAddress,
    abi: blemastABI,
    functionName: 'hasRole',
    args: [MINTER_ROLE, userAddress!],
    query: { enabled: !!userAddress && !!contractAddress }
  })

  const pauserQuery = useReadContract({
    address: contractAddress,
    abi: blemastABI,
    functionName: 'hasRole',
    args: [PAUSER_ROLE, userAddress!],
    query: { enabled: !!userAddress && !!contractAddress }
  })

  const adminQuery = useReadContract({
    address: contractAddress,
    abi: blemastABI,
    functionName: 'hasRole',
    args: [DEFAULT_ADMIN_ROLE, userAddress!],
    query: { enabled: !!userAddress && !!contractAddress }
  })

  return {
    isMinter: minterQuery.data || false,
    isPauser: pauserQuery.data || false,
    isAdmin: adminQuery.data || false,
    isLoading: minterQuery.isLoading || pauserQuery.isLoading || adminQuery.isLoading,
    error: minterQuery.error || pauserQuery.error || adminQuery.error
  }
}
```

#### `useTransferToken.ts` - Token Transfer
```typescript
export function useTransferToken() {
  const { address: contractAddress } = useContract()
  const { refetch: refetchBalance } = useTokenBalance()

  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const transfer = useCallback((to: Address, amount: string) => {
    const amountWei = parseUnits(amount, 18)

    writeContract({
      address: contractAddress!,
      abi: blemastABI,
      functionName: 'transfer',
      args: [to, amountWei]
    })
  }, [contractAddress, writeContract])

  // Refetch balance on success
  useEffect(() => {
    if (isSuccess) {
      refetchBalance()
    }
  }, [isSuccess, refetchBalance])

  return {
    transfer,
    txHash: hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error
  }
}
```

### 4.2 Error Handling Strategy

**Contract Error Parsing:**
```typescript
function parseContractError(error: Error): string {
  const message = error.message

  if (message.includes('MintRateLimitExceeded')) {
    return 'Mint rate limit exceeded. Please wait for the next period.'
  }
  if (message.includes('MaxSupplyExceeded')) {
    return 'This mint would exceed the maximum supply of 1 billion BLE.'
  }
  if (message.includes('AccessControlUnauthorizedAccount')) {
    return 'You do not have permission to perform this action.'
  }
  if (message.includes('EnforcedPause')) {
    return 'Contract is paused. All transfers are disabled.'
  }

  // Generic fallback
  return 'Transaction failed. Please check your wallet and try again.'
}
```

### 4.3 Component Examples

#### TransferForm Component Structure
```typescript
export function TransferForm() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const { balance } = useTokenBalance()
  const { isPaused } = useContractStatus()
  const { transfer, isPending, isSuccess, error, txHash } = useTransferToken()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isValid) {
      transfer(recipient as Address, amount)
    }
  }

  return (
    <Card title="Transfer BLE Tokens">
      <form onSubmit={handleSubmit}>
        <Input
          label="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          validation={isAddress}
          error={addressError}
        />
        <Input
          label="Amount (BLE)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          hint={`Balance: ${balance} BLE`}
          rightElement={<MaxButton onClick={fillMax} />}
          validation={validateAmount}
          error={amountError}
        />
        <Button
          type="submit"
          disabled={!isValid || isPaused || isPending}
          loading={isPending}
        >
          Transfer
        </Button>
      </form>
      {isSuccess && (
        <Alert variant="success">
          Transfer successful! <BaseScanLink txHash={txHash} />
        </Alert>
      )}
      {error && <Alert variant="error">{error}</Alert>}
    </Card>
  )
}
```

---

## 5. Testing Strategy

### 5.1 Unit Tests (Vitest + React Testing Library)

```typescript
// Example: Test utility function
describe('formatBLE', () => {
  it('formats wei to BLE with commas', () => {
    expect(formatBLE(parseUnits('1234567.89', 18))).toBe('1,234,567.89 BLE')
  })

  it('handles zero', () => {
    expect(formatBLE(0n)).toBe('0 BLE')
  })
})

// Example: Test component
describe('TransferForm', () => {
  it('validates amount > balance', async () => {
    render(<TransferForm userBalance="100" />)
    const input = screen.getByLabelText(/Amount/i)

    await userEvent.type(input, '200')
    await userEvent.tab()

    expect(screen.getByText(/Insufficient balance/i)).toBeInTheDocument()
  })
})
```

### 5.2 E2E Tests (Playwright)

```typescript
test('transfer tokens successfully', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('button:has-text("Connect Wallet")')

  // Fill form
  await page.fill('input[name="recipient"]', TEST_RECIPIENT_ADDRESS)
  await page.fill('input[name="amount"]', '10')

  // Submit
  await page.click('button:has-text("Transfer")')

  // Verify success
  await page.waitForSelector('text=Transfer successful', { timeout: 30000 })
})
```

### 5.3 Accessibility Tests (jest-axe)

```typescript
test('TransferForm has no accessibility violations', async () => {
  const { container } = render(<TransferForm userBalance="1000" />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 5.4 Coverage Targets

- **Phase 1-3 (MVP):** 80%+ coverage
- **Phase 4-6 (Full Release):** 90%+ coverage
- **Critical paths:** 100% coverage (transfer, mint, burn, role management)

---

## 6. Accessibility Requirements (WCAG 2.1 AA)

### Perceivable
- [ ] All images have alt text
- [ ] Color contrast ratios ≥ 4.5:1 for normal text, 3:1 for large text
- [ ] Information not conveyed by color alone (use icons + text)
- [ ] Text resizable to 200% without loss of functionality

### Operable
- [ ] All functionality available via keyboard
- [ ] Visible focus indicators (outline, ring)
- [ ] No keyboard traps
- [ ] Skip links for keyboard users
- [ ] Sufficient time for interactions

### Understandable
- [ ] Page language declared: `<html lang="en">`
- [ ] Labels for all form inputs
- [ ] Error messages are clear and descriptive
- [ ] Consistent navigation

### Robust
- [ ] Valid HTML (semantic elements)
- [ ] ARIA attributes used correctly
- [ ] Tested with screen readers (NVDA, VoiceOver)

**Testing Tools:**
- axe DevTools browser extension
- Lighthouse accessibility audit
- jest-axe for automated testing
- Manual screen reader testing

---

## 7. Performance Optimization

### Bundle Size Targets
- **Main bundle:** <300KB
- **Total first load JS:** <500KB

### Strategies
- Use dynamic imports for large components
- Tree-shake unused OnchainKit components
- Optimize images with `next/image`
- Code splitting by route (automatic with App Router)
- Aggressive caching with React Query

### Network Optimization
- Batch contract reads with `useReadContracts`
- Reduce RPC calls with caching
- Use multicall for multiple reads

---

## 8. Security Best Practices

### Input Validation
- Always validate on client AND assume contract validates
- Use viem's `isAddress()` for address validation
- Sanitize all user input (prevent XSS)
- Use TypeScript strict mode

### Transaction Security
- Use wagmi's built-in simulation before writes
- Show transaction preview before submission
- Never auto-approve transactions
- Warn users of irreversible actions

### Role-Based Access
- Always check roles on-chain (never trust client state)
- Hide sensitive functions from UI if no role
- Show clear "permission denied" messages

### Environment Variables
- Use `NEXT_PUBLIC_` prefix ONLY for public data
- NEVER expose private keys in frontend
- Store sensitive data in .env.local (gitignored)

---

## 9. Deployment & CI/CD

### Environment Variables

```bash
# .env.local (not committed)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=...
NEXT_PUBLIC_BLEMAST_SEPOLIA_ADDRESS=0x8B7a00F56e46B422f52f059478eb7E9B5167E907
NEXT_PUBLIC_BLEMAST_MAINNET_ADDRESS=0x... (TBD)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=... (if using WalletConnect)
```

### Build Process

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test         # Unit/integration tests
npm run test:e2e     # Playwright tests
npm run build        # Production bundle
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

### Deployment Platforms
- **Vercel** (recommended): Zero-config, automatic previews
- **Netlify**: Alternative with similar features
- **AWS Amplify**: If already using AWS

---

## 10. Success Criteria

### MVP (Phases 1-3)
- [ ] Users can connect wallet and view balance
- [ ] Users can transfer BLE tokens
- [ ] Users can burn BLE tokens
- [ ] Network detection and switching works
- [ ] Transaction status feedback is clear
- [ ] 80%+ test coverage
- [ ] WCAG AA compliant
- [ ] Lighthouse score: 90+ (Performance, Accessibility, Best Practices)

### Full Release (Phases 4-6)
- [ ] MINTER_ROLE holders can mint tokens
- [ ] PAUSER_ROLE holders can pause/unpause
- [ ] DEFAULT_ADMIN_ROLE holders can manage roles
- [ ] Activity feed displays all events
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] 90%+ test coverage
- [ ] Zero accessibility violations (axe-core)
- [ ] Lighthouse score: 95+ across all metrics

---

## 11. Risk Assessment & Mitigation

### Identified Risks

1. **RPC Rate Limits**
   - **Risk:** Public RPC endpoints may have rate limits
   - **Mitigation:** Use paid RPC provider (Alchemy, Infura) or OnchainKit's RPC
   - **Mitigation:** Implement aggressive caching

2. **Wallet Connection Issues**
   - **Risk:** Users may struggle with wallet connection
   - **Mitigation:** Use OnchainKit's Wallet component (battle-tested)
   - **Mitigation:** Provide clear error messages and troubleshooting guide

3. **Network Congestion**
   - **Risk:** High gas fees or slow confirmations on Base
   - **Mitigation:** Display estimated gas fees before tx
   - **Mitigation:** Allow users to adjust gas (if needed)

4. **Browser Compatibility**
   - **Risk:** Issues with older browsers
   - **Mitigation:** Test on Chrome, Firefox, Safari, Edge
   - **Mitigation:** Use Next.js transpilation

5. **Mobile UX**
   - **Risk:** Poor experience on mobile devices
   - **Mitigation:** Mobile-first design approach
   - **Mitigation:** Test on real devices (iOS, Android)

6. **Security Vulnerabilities**
   - **Risk:** XSS, phishing, wallet draining
   - **Mitigation:** Input validation, CSP headers, security audits
   - **Mitigation:** Use wagmi's built-in protections

---

## 12. Documentation Requirements

### User-Facing Documentation
- [ ] README.md: Project overview, setup instructions
- [ ] USAGE.md: How to use the app
- [ ] FAQ.md: Common questions

### Developer Documentation
- [ ] ARCHITECTURE.md: System overview, data flow
- [ ] CONTRIBUTING.md: Coding standards, PR process
- [ ] API.md: Contract ABI, function signatures
- [ ] TESTING.md: Testing strategy, coverage goals

### Inline Documentation
- JSDoc comments for all public functions
- Prop type documentation in TypeScript
- Complex logic explained with inline comments

---

## 13. Final Recommendations

1. ✅ **Start with Phase 1-3** for a usable MVP (transfer, burn, dashboard)
2. ✅ **Prioritize accessibility and testing** from the beginning
3. ✅ **Use OnchainKit components** where possible (Wallet, TransactionStatus)
4. ✅ **Set up CI/CD early** to catch regressions
5. ✅ **Deploy to staging** (Vercel preview) for testing
6. ✅ **Get user feedback** after Phase 3 before building admin features
7. ✅ **Monitor analytics** to understand user behavior
8. ✅ **Document as you build** (don't defer to the end)
9. ✅ **Keep bundle size small** (<500KB total first load JS)
10. ✅ **Plan for mobile users** (majority of crypto users are on mobile)

---

## Appendix: Resources

### Next.js
- [Next.js 15 Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### wagmi & viem
- [wagmi Docs](https://wagmi.sh/)
- [viem Docs](https://viem.sh/)

### OnchainKit
- [OnchainKit Docs](https://onchainkit.xyz/)
- [OnchainKit GitHub](https://github.com/coinbase/onchainkit)

### Testing
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Base Chain
- [Base Docs](https://docs.base.org/)
- [BaseScan Sepolia](https://sepolia.basescan.org/)

---

**This comprehensive plan provides a clear roadmap for building a production-ready, accessible, and user-friendly frontend for the Blemast ERC20 token. Follow the phases sequentially, prioritize testing and accessibility, and iterate based on user feedback.**

🚀 **Ready to build!**
