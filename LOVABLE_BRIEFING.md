# Snowball Debt Calculator - Complete Application Brief

## Executive Summary

Snowball is a premium debt payoff calculator that helps users eliminate debt using proven financial strategies. The application compares two debt elimination methods (Snowball and Avalanche), provides visualizations, and creates personalized payment plans.

**Target Aesthetic**: Swiss luxury spa - minimal, refined, premium feel worth thousands/month

---

## Core Functionality

### Primary Purpose
Calculate and visualize debt payoff strategies using two methods:
1. **Snowball Method**: Pay off smallest balance first (psychological wins)
2. **Avalanche Method**: Pay off highest APR first (maximize savings)

### Key Features
- User authentication (Supabase Auth)
- Multi-debt management (CRUD operations)
- Real-time payoff calculations
- Interactive comparison charts
- Month-by-month payment breakdown
- Interest savings calculator
- Debt-free date projections
- Extra payment optimization

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React (ONLY icon library to use)
- **Charts**: Recharts
- **State**: React hooks (useState, useEffect, useMemo)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Client**: @supabase/supabase-js, @supabase/ssr

### Forms & Validation
- **Form Library**: react-hook-form
- **Schema Validation**: Zod (@hookform/resolvers)
- **Input Sanitization**: Custom validation library

---

## Database Schema

### Tables

#### `debts`
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users)
- name: TEXT (e.g., "Credit Card 1")
- balance: DECIMAL(10, 2) (current debt amount)
- minimum_payment: DECIMAL(10, 2) (monthly minimum)
- apr: DECIMAL(5, 2) (annual percentage rate, 0-100)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `user_settings`
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → auth.users, UNIQUE)
- extra_payment: DECIMAL(10, 2) (additional monthly payment)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Row Level Security
- All tables have RLS enabled
- Users can only access their own data
- Policies: SELECT, INSERT, UPDATE, DELETE (scoped to auth.uid())

---

## Data Models & Types

### TypeScript Interfaces

```typescript
interface Debt {
  id: string
  name: string
  balance: number          // Total amount owed
  minimum_payment: number  // Monthly minimum
  apr: number             // Annual percentage rate (0-100)
}

interface MonthlyPayment {
  month: number
  debtName: string
  payment: number          // Total paid this month
  principal: number        // Amount to principal
  interest: number         // Interest charged
  remainingBalance: number // Balance after payment
}

interface PayoffStrategy {
  method: 'snowball' | 'avalanche'
  monthlyPayments: MonthlyPayment[]
  totalInterestPaid: number
  monthsToPayoff: number
  debtPayments: {
    debtId: string
    debtName: string
    monthlyPayment: number
  }[]
}

interface CalculationResult {
  snowball: PayoffStrategy
  avalanche: PayoffStrategy
  debts: Debt[]
  extraPayment: number
}
```

---

## Calculation Logic

### Core Algorithm (`/lib/calculations/payoff.ts`)

**Snowball Method**:
1. Sort debts by balance (smallest first)
2. Pay minimum on all debts
3. Apply extra payment + freed-up minimums to smallest debt
4. Once paid off, roll payment to next smallest
5. Continue until all debts eliminated

**Avalanche Method**:
1. Sort debts by APR (highest first)
2. Pay minimum on all debts
3. Apply extra payment + freed-up minimums to highest APR debt
4. Once paid off, roll payment to next highest APR
5. Continue until all debts eliminated

**Monthly Interest Calculation**:
```
monthlyRate = APR / 100 / 12
interest = balance × monthlyRate
```

**Validation**:
- Balance ≥ 0
- Minimum payment ≥ 0
- APR between 0-100
- Extra payment ≥ 0
- Safety limit: 600 months maximum

---

## Application Structure

### Pages (`/app`)

#### 1. **Landing Page** (`/app/page.tsx`)
**Purpose**: Marketing homepage, first impression
**Status**: ✅ Redesigned with premium aesthetic

**Sections**:
- Fixed navbar with logo, Sign in, Get Started CTA
- Hero section with headline, subheading, dual CTAs
- Stats row (3 metrics: avg saved, faster payoff, users)
- Features grid (3 cards: Smart Strategies, Visual Progress, Save Thousands)
- Final CTA section
- Footer

**Key Elements**:
- Lucide icons: TrendingDown (logo), Sparkles (badge), Target, LineChart, ArrowRight
- Typography: 5xl-6xl headlines, medium weight
- Spacing: 32px section padding, 80px between sections
- Cards: Elevated surface (#151515), 1px border (#252525)

#### 2. **Dashboard** (`/app/dashboard/page.tsx`)
**Purpose**: User's home screen, overview of all debts
**Status**: ⚠️ Needs redesign with new aesthetic

**Features**:
- 4 metric cards: Total Debt, Debt-Free Date, Next Payment, Minimum Monthly
- Extra payment form (input + update button)
- Debts table (sortable by APR)
- High-interest debt warning
- Quick navigation to Manage Debts and Results
- Onboarding wizard (for first-time users)
- Empty state (if no debts)

**Calculations**:
```typescript
totalDebt = sum of all balances
totalMinimumPayment = sum of all minimum payments
estimatedMonths = totalDebt / (totalMinimumPayment + extraPayment)
debtFreeDate = today + estimatedMonths
```

#### 3. **Manage Debts** (`/app/debts/page.tsx`)
**Purpose**: CRUD operations for debts
**Status**: ⚠️ Needs redesign

**Features**:
- List all user debts
- Add new debt (form with real-time validation)
- Edit existing debt (inline or modal)
- Delete debt (with confirmation dialog)
- Form validation with warnings:
  - Balance warnings: < $100 or > $100,000
  - Minimum payment warnings: < 2% or > 20% of balance
  - APR warnings: < 3% or > 30%

**Form Fields**:
```typescript
{
  name: string          // e.g., "Chase Visa"
  balance: number       // Current amount owed
  minimum_payment: number
  apr: number          // 0-100
}
```

#### 4. **Results** (`/app/results/page.tsx`)
**Purpose**: Visualize and compare payoff strategies
**Status**: ⚠️ Needs redesign + emoji removal

**Features**:
- Method toggle (Snowball / Avalanche)
- Comparison summary card (side-by-side metrics)
- Two interactive charts:
  1. **Total Debt Over Time**: Line chart showing balance decline
  2. **Debt Payoff Timeline**: Stacked area chart per debt
- Expandable payment table (month-by-month breakdown)
- Method info modal (explains Snowball vs Avalanche)
- Export/share functionality (future)

**Emojis to Replace** (🚨 CRITICAL):
- 💰 → Use `DollarSign` icon
- Month numbers → Keep as plain numbers
- Time indicators → Use `Clock` icon

#### 5. **Login** (`/app/login/page.tsx`)
**Purpose**: User authentication
**Status**: ⚠️ Needs redesign

**Features**:
- Email + password form
- Remember me checkbox (optional)
- Forgot password link
- Sign up redirect
- Error handling

#### 6. **Sign Up** (`/app/signup/page.tsx`)
**Purpose**: User registration
**Status**: ⚠️ Needs redesign

**Features**:
- Email + password + confirm password
- Terms acceptance checkbox
- Login redirect
- Email verification flow (Supabase)

---

## Components

### Core UI Components (`/components/ui`)

#### **Button** (`Button.tsx`)
```typescript
variants: 'primary' | 'secondary' | 'ghost'
sizes: 'sm' | 'md' | 'lg'
```
- Primary: White background, black text
- Secondary: Transparent, white text, border
- Ghost: Transparent, hover state only

#### **Card** (`Card.tsx`)
```typescript
Components: Card, CardHeader, CardTitle, CardDescription, CardContent
hover?: boolean  // Adds hover effect
```
- Elevated surface (#151515)
- 1px border (#252525)
- 12px border radius

#### **Input** (`Input.tsx`)
```typescript
label?: string
error?: string
helperText?: string
```
- Dark background (#151515)
- White border on focus
- Error state (red border)

#### **Container** (`Container.tsx`)
```typescript
sizes: 'sm' | 'md' | 'lg' | 'xl' | 'full'
```
- Responsive max-widths
- Horizontal padding: 24px mobile, 48px desktop

### Feature Components (`/components`)

#### **Navbar** (`Navbar.tsx` and `ui/Navbar.tsx`)
**Status**: ⚠️ Two versions exist (needs consolidation)

**Features**:
- Fixed/sticky positioning
- Logo + app name
- Navigation links (Dashboard, Debts, Results)
- Debt count badge
- Logout button
- Mobile hamburger menu
- Scroll-based background blur

#### **Footer** (`Footer.tsx`)
**Status**: ✅ Redesigned

**Features**:
- 3-column layout: Logo, Links, Copyright
- Links: Privacy, Terms, Contact
- Minimal styling

#### **Toast** (`Toast.tsx`)
**Purpose**: Notification system

**Types**:
- Success (green)
- Error (red)
- Info (blue)
- Warning (yellow)

**Usage**:
```typescript
const { showSuccess, showError } = useToast()
showSuccess('Debt added successfully!')
showError('Failed to save debt')
```

#### **OnboardingWizard** (`OnboardingWizard.tsx`)
**Purpose**: First-time user guide
**Status**: ⚠️ Contains emojis, needs redesign

**Emojis to Replace**:
- 🎯 → Target icon
- 📊 → BarChart icon
- 💪 → TrendingUp icon

#### **DebtMethodInfo** (`DebtMethodInfo.tsx`)
**Purpose**: Educational modal explaining Snowball vs Avalanche
**Status**: ⚠️ Contains emojis, needs redesign

**Emojis to Replace**:
- ❄️ → Snowflake icon (or just remove)
- 🎯 → Target icon
- 💰 → DollarSign icon

#### **ConfirmDialog** (`ui/ConfirmDialog.tsx`)
**Purpose**: Confirmation prompts (e.g., delete debt)

**Props**:
```typescript
{
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}
```

#### **Charts** (`/components/charts`)

**DebtPayoffChart** (`DebtPayoffChart.tsx`):
- Stacked area chart
- Shows each debt's balance over time
- Color-coded per debt
- Tooltip with monthly details

**TotalDebtChart** (`TotalDebtChart.tsx`):
- Line chart
- Total debt balance over time
- Comparison between Snowball and Avalanche

**Library**: Recharts
**Styling**: Match premium dark theme

---

## User Flows

### 1. **New User Onboarding**
```
1. Land on homepage → See hero + features
2. Click "Get Started" → Sign up form
3. Verify email (Supabase) → Auto-login
4. Redirect to Dashboard → See onboarding wizard
5. Click "Add your first debt" → Debts page
6. Fill out debt form → Submit
7. Return to Dashboard → See metrics populate
8. Navigate to Results → See payoff strategies
```

### 2. **Returning User Session**
```
1. Login → Redirect to Dashboard
2. View overview metrics
3. Optionally:
   - Update extra payment
   - Add/edit/delete debts
   - View results and charts
   - Compare methods
4. Logout
```

### 3. **Managing Debts**
```
1. Dashboard → Click "Manage Debts"
2. View all debts in table
3. Click "Add Debt" → Form appears
4. Fill fields with real-time validation
5. Submit → Debt added, table updates
6. Edit: Click pencil icon → Inline edit
7. Delete: Click trash icon → Confirm dialog → Delete
```

### 4. **Viewing Payoff Strategy**
```
1. Dashboard → Click "View Payoff Strategy"
2. Results page loads with calculations
3. Toggle between Snowball/Avalanche
4. Review comparison metrics:
   - Interest saved
   - Time saved
   - Total cost
5. Explore charts:
   - Zoom, hover for details
6. Expand payment table → See month-by-month breakdown
7. Click "Learn More" → Method info modal
```

---

## Design System

### Colors (Premium Monochrome)

```
Background:
- Primary: #0A0A0A (pure black)
- Elevated: #151515 (subtle depth)

Text:
- Primary: #FAFAFA (almost white)
- Muted: #999999 (medium gray)
- Subtle: #666666 (darker gray)

Borders:
- Default: #252525
- Subtle: #1A1A1A

Accent:
- Primary: #FAFAFA (white as accent)
- Muted: #E5E5E5 (slightly off-white)

States:
- Success: #22C55E
- Error: #EF4444
- Warning: #F59E0B
- Info: #3B82F6
```

### Typography

**Font Family**:
```
-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
```

**Font Sizes**:
```
xs:   12px / 1.5    (letter-spacing: 0.02em)
sm:   14px / 1.6    (letter-spacing: 0.01em)
base: 16px / 1.6    (letter-spacing: 0)
lg:   18px / 1.6    (letter-spacing: -0.01em)
xl:   20px / 1.5    (letter-spacing: -0.01em)
2xl:  24px / 1.4    (letter-spacing: -0.02em)
3xl:  30px / 1.3    (letter-spacing: -0.02em)
4xl:  36px / 1.2    (letter-spacing: -0.03em)
5xl:  48px / 1.1    (letter-spacing: -0.03em)
6xl:  60px / 1.0    (letter-spacing: -0.04em)
```

**Font Weights**:
- Regular: 400 (rare, mostly for body text)
- Medium: 500 (default for UI)
- Semibold: 600 (rare, for emphasis)

### Spacing

**Scale** (Tailwind defaults + custom):
```
1:  4px
2:  8px
3:  12px
4:  16px
6:  24px
8:  32px
12: 48px
16: 64px
18: 72px   (custom)
20: 80px
22: 88px   (custom)
24: 96px
32: 128px
```

**Common Patterns**:
- Card padding: `p-6` or `p-8` (24px or 32px)
- Section padding: `py-32` (128px vertical)
- Section spacing: `mb-20` (80px between major blocks)
- Component gaps: `gap-6` (24px)
- Container horizontal: `px-6 lg:px-12` (24px mobile, 48px desktop)

### Effects

**Shadows**:
```
subtle:   0 1px 3px 0 rgba(0, 0, 0, 0.3)
elevated: 0 4px 12px 0 rgba(0, 0, 0, 0.4)
premium:  0 8px 24px 0 rgba(0, 0, 0, 0.5)
```

**Transitions**:
```
Default: cubic-bezier(0.16, 1, 0.3, 1)
Duration: 150ms (fast), 200ms (normal), 400ms (slow)
```

**Border Radius**:
```
sm: 4px
md: 6px
lg: 8px
xl: 12px
```

**Focus States**:
```
outline: 2px solid #FAFAFA
outline-offset: 2px
```

---

## Authentication Flow

### Sign Up
1. User enters email + password
2. Frontend validates (Zod schema)
3. Call `supabase.auth.signUp()`
4. Supabase sends verification email
5. User clicks link in email
6. Redirect to app, auto-login
7. Create default `user_settings` row

### Login
1. User enters email + password
2. Call `supabase.auth.signInWithPassword()`
3. On success, redirect to `/dashboard`
4. On error, show error toast

### Session Management
- Supabase handles sessions automatically
- Cookie-based auth (SSR compatible)
- Protected routes check `auth.getUser()`
- If no user, redirect to `/login`

### Logout
1. Call `supabase.auth.signOut()`
2. Clear session
3. Redirect to landing page

---

## API/Data Fetching Patterns

### Reading Data
```typescript
// Get user
const { data: { user } } = await supabase.auth.getUser()

// Get debts
const { data, error } = await supabase
  .from('debts')
  .select('*')
  .order('apr', { ascending: false })

// Get settings
const { data } = await supabase
  .from('user_settings')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

### Writing Data
```typescript
// Insert debt
const { data, error } = await supabase
  .from('debts')
  .insert({
    user_id: user.id,
    name: 'Credit Card',
    balance: 5000,
    minimum_payment: 100,
    apr: 18.5
  })

// Update debt
const { error } = await supabase
  .from('debts')
  .update({ balance: 4500 })
  .eq('id', debtId)

// Delete debt
const { error } = await supabase
  .from('debts')
  .delete()
  .eq('id', debtId)
```

### Error Handling
```typescript
if (error) {
  showError(`Failed: ${error.message}`)
  return
}

showSuccess('Operation successful!')
```

---

## Validation Rules

### Debt Validation

**Name**:
- Required
- Min length: 1
- Max length: 100
- Sanitize: Remove HTML, scripts

**Balance**:
- Required
- Type: Number
- Min: 0.01
- Max: 999,999,999.99
- Warnings:
  - < $100: "Unusually low balance"
  - > $100,000: "Large balance detected"

**Minimum Payment**:
- Required
- Type: Number
- Min: 0.01
- Max: Balance × 2
- Warnings:
  - < 2% of balance: "Low minimum payment"
  - > 20% of balance: "High minimum payment"

**APR**:
- Required
- Type: Number
- Min: 0
- Max: 100
- Warnings:
  - < 3%: "Low APR"
  - > 30%: "Very high APR"

### Extra Payment Validation
- Optional
- Type: Number
- Min: 0
- Max: 999,999,999.99
- Default: 0

---

## Formatters & Utilities

### Currency Formatting
```typescript
formatCurrency(5432.10)
// Output: "$5,432.10"

// Implementation
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
```

### Percent Formatting
```typescript
formatPercent(18.5)
// Output: "18.50%"

// Implementation
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}
```

### Date Formatting
```typescript
const debtFreeDate = new Date()
debtFreeDate.setMonth(debtFreeDate.getMonth() + estimatedMonths)

debtFreeDate.toLocaleDateString('en-US', {
  month: 'short',
  year: 'numeric'
})
// Output: "Dec 2027"
```

### Input Sanitization
```typescript
// Remove HTML tags, scripts, dangerous characters
sanitizeInput(userInput)
```

---

## Performance Considerations

### Calculation Optimization
- Memoize calculations with `useMemo()`
- Only recalculate when debts or extra payment changes
- Safety limit: 600 months maximum
- Early exit if all debts paid off

### Data Fetching
- Load debts and settings in parallel
- Use Supabase indexes on `user_id`
- Row-level security at database level
- Client-side caching with React state

### Chart Performance
- Recharts handles virtualization
- Limit data points if > 1000 months (shouldn't happen)
- Debounce chart updates

---

## Responsive Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Mobile-First Approach
- Default styles for mobile
- Add complexity at larger breakpoints
- Stack cards vertically on mobile
- Horizontal layouts at `md:` and above
- Hide/show elements with `hidden md:flex` patterns

### Critical Responsive Patterns
```tsx
// Container widths
<Container size="lg">  // Responsive padding

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Navigation
<nav className="hidden md:flex">  // Desktop nav
<button className="md:hidden">   // Mobile hamburger

// Typography scaling
<h1 className="text-5xl lg:text-6xl">

// Spacing adjustments
<section className="py-20 md:py-32">
```

---

## Key Differentiators (Why This App Rocks)

1. **Visual Comparison**: Side-by-side Snowball vs Avalanche
2. **Month-by-Month Breakdown**: Exact payment schedule
3. **Interactive Charts**: Recharts with hover details
4. **Real-Time Validation**: Immediate feedback on forms
5. **Premium UX**: Swiss luxury spa aesthetic
6. **Fast Calculations**: Client-side (no server delay)
7. **Secure**: Supabase RLS, no data leaks
8. **Responsive**: Perfect on all devices

---

## Current Status & Priorities

### ✅ Completed
- Landing page (premium redesign)
- Footer (minimal redesign)
- UI components (Button, Card, Input, Container)
- Design system (colors, typography, spacing)
- Calculation logic (Snowball & Avalanche)
- Database schema & RLS policies
- Authentication flow

### ⚠️ Needs Work
- **Dashboard**: Redesign with new aesthetic
- **Debts page**: Redesign CRUD interface
- **Results page**: Replace emojis, redesign charts
- **Navbar**: Consolidate two versions, minimal redesign
- **OnboardingWizard**: Replace emojis, redesign
- **DebtMethodInfo**: Replace emojis, redesign
- **Login/Signup**: Minimal redesign

### 🚨 Critical: Remove ALL Emojis
**Files containing emojis**:
- `app/results/page.tsx`
- `components/OnboardingWizard.tsx`
- `components/DebtMethodInfo.tsx`

**Replacement Strategy**:
- Use Lucide React icons ONLY
- Maintain semantic meaning
- Keep visual hierarchy

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

---

## File Structure

```
snowball-calculator/
├── app/
│   ├── dashboard/page.tsx     (User home screen)
│   ├── debts/page.tsx         (CRUD for debts)
│   ├── results/page.tsx       (Visualization)
│   ├── login/page.tsx         (Auth)
│   ├── signup/page.tsx        (Registration)
│   ├── page.tsx              (Landing page)
│   ├── layout.tsx            (Root layout)
│   └── globals.css           (Global styles)
├── components/
│   ├── ui/                   (Reusable primitives)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Container.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Tooltip.tsx
│   │   └── Navbar.tsx
│   ├── charts/               (Recharts components)
│   │   ├── DebtPayoffChart.tsx
│   │   └── TotalDebtChart.tsx
│   ├── Navbar.tsx            (Main navbar)
│   ├── Footer.tsx            (Footer)
│   ├── Toast.tsx             (Notifications)
│   ├── OnboardingWizard.tsx  (First-time guide)
│   └── DebtMethodInfo.tsx    (Educational modal)
├── lib/
│   ├── calculations/
│   │   └── payoff.ts         (Core algorithms)
│   ├── supabase/
│   │   ├── client.ts         (Supabase client)
│   │   └── middleware.ts     (Auth middleware)
│   ├── formatters.ts         (Currency, percent, date)
│   └── validation.ts         (Input sanitization)
├── types/
│   └── debt.types.ts         (TypeScript interfaces)
├── supabase-schema.sql       (Database DDL)
├── tailwind.config.ts        (Design tokens)
└── package.json              (Dependencies)
```

---

## Dependencies

```json
{
  "dependencies": {
    "next": "16.0.0",
    "react": "^19",
    "react-dom": "^19",
    "typescript": "^5",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "recharts": "^2",
    "zod": "^3",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "lucide-react": "^0.263",
    "tailwindcss": "^4.1",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

---

## Testing Checklist

### Functionality
- [ ] User can sign up and verify email
- [ ] User can log in with correct credentials
- [ ] User can add a debt with valid data
- [ ] Form shows errors for invalid inputs
- [ ] Form shows warnings for unusual values
- [ ] User can edit an existing debt
- [ ] User can delete a debt (with confirmation)
- [ ] Dashboard shows correct metrics
- [ ] Extra payment updates correctly
- [ ] Results page calculates Snowball correctly
- [ ] Results page calculates Avalanche correctly
- [ ] Charts render without errors
- [ ] Payment table expands/collapses
- [ ] Method toggle switches strategies
- [ ] Logout works and redirects

### Design
- [ ] All pages match premium aesthetic
- [ ] No emojis present anywhere
- [ ] Only Lucide React icons used
- [ ] Typography follows scale
- [ ] Spacing is consistent (no cramped/wasted)
- [ ] Colors match design system
- [ ] Hover states work smoothly
- [ ] Focus states are visible
- [ ] Buttons have proper states (hover, active, disabled)

### Responsive
- [ ] Mobile: All layouts stack properly
- [ ] Mobile: Navigation is accessible
- [ ] Mobile: Forms are usable
- [ ] Tablet: 2-column grids work
- [ ] Desktop: 3+ column grids work
- [ ] Desktop: Sidebar layouts work
- [ ] All breakpoints tested (sm, md, lg, xl)

### Accessibility
- [ ] All buttons have labels
- [ ] All icons have aria-labels
- [ ] Focus states are visible
- [ ] Forms have proper labels
- [ ] Error messages are announced
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works

---

## Success Metrics

### User Experience
- **Load time**: < 2 seconds to interactive
- **Calculation speed**: < 100ms for 50 debts × 600 months
- **Form validation**: < 50ms debounce
- **Chart rendering**: < 500ms

### Business Goals
- **Debt-free date accuracy**: Within 1 month of actual
- **Interest calculation accuracy**: Within $1 of actual
- **User retention**: Dashboard visit 2+ times/week

---

## Future Enhancements (Out of Scope for Lovable)

1. **Payment Reminders**: Email/SMS notifications
2. **Export Options**: PDF reports, CSV downloads
3. **Debt Milestones**: Celebrate payoffs with animations
4. **Savings Goals**: Link debt payoff to savings timeline
5. **Refinancing Calculator**: Show refinance vs payoff
6. **Shared Plans**: Multi-user households
7. **Mobile App**: React Native version
8. **AI Insights**: Personalized recommendations

---

## Lovable-Specific Notes

### What to Focus On
1. **Redesign Dashboard**: Most important page, user home
2. **Redesign Debts CRUD**: Core functionality
3. **Remove Emojis**: Critical for premium feel
4. **Consolidate Navbars**: Two versions exist, pick one
5. **Chart Aesthetics**: Match dark theme, premium feel

### What to Keep Exactly
- Calculation logic (don't touch `/lib/calculations/payoff.ts`)
- Database schema (it's already deployed)
- Authentication flow (Supabase is configured)
- TypeScript types (they're correct)

### Design Philosophy
- **Minimal > Decorative**: Remove, don't add
- **Breathing room**: Space is luxury
- **Precision**: Pixel-perfect alignment
- **Monochrome**: No colors except functional (red errors, green success)
- **Typography**: Let type do the heavy lifting
- **Icons**: Lucide React only, 16-20px sizing

### Responsive Strategy
- **Mobile-first**: Start with stacked layouts
- **Progressive enhancement**: Add columns at breakpoints
- **Touch targets**: 44px minimum on mobile
- **Thumb zones**: CTAs in easy-to-reach areas

---

## Contact & Resources

- **Documentation**: Next.js 16 (App Router), Supabase, Recharts, Lucide React
- **Design Inspiration**: Apple, Linear, Stripe, Vercel, Raycast
- **Color Palette**: Pure monochrome (#0A0A0A to #FAFAFA)
- **Icon Library**: https://lucide.dev

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Ready for Lovable redesign
