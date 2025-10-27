# Debt Payoff Calculation Logic

This document explains how the snowball and avalanche debt payoff methods are calculated in the app.

## Overview

Both methods follow the same basic principle:
1. Pay the minimum payment on all debts
2. Apply extra payment to one specific debt (the "target" debt)
3. When a debt is paid off, roll its payment to the next target debt
4. Continue until all debts are paid

The **only difference** is how the target debt is chosen.

## Snowball Method

**Strategy**: Pay off the smallest balance first

**Order**: Debts sorted by balance (smallest → largest)

**Pros**:
- Quick wins provide psychological motivation
- Faster elimination of individual debts
- Simpler to stick with long-term

**Cons**:
- May pay more interest overall
- Takes longer if high-interest debt has large balance

**Example**:
```
Debt A: $1,000 @ 5% APR, $50 min → TARGET (smallest balance)
Debt B: $5,000 @ 15% APR, $150 min
Debt C: $10,000 @ 8% APR, $200 min

Month 1: Pay $50 to A, $150 to B, $200 to C, +$300 extra to A
When A is paid: Roll $350 to B (next smallest)
```

## Avalanche Method

**Strategy**: Pay off the highest interest rate first

**Order**: Debts sorted by APR (highest → lowest)

**Pros**:
- Mathematically optimal
- Saves the most money in interest
- Faster total payoff time

**Cons**:
- May take longer to see first debt eliminated
- Requires more discipline/patience

**Example**:
```
Debt A: $1,000 @ 5% APR, $50 min
Debt B: $5,000 @ 15% APR, $150 min → TARGET (highest APR)
Debt C: $10,000 @ 8% APR, $200 min

Month 1: Pay $50 to A, $150 to B, $200 to C, +$300 extra to B
When B is paid: Roll $450 to C (next highest APR)
```

## Monthly Payment Calculation

For each debt each month:

### 1. Calculate Monthly Interest
```
monthlyInterest = balance × (APR / 100 / 12)
```

### 2. Apply Minimum Payment
```
principalFromMinimum = minimumPayment - monthlyInterest
newBalance = balance - principalFromMinimum
```

### 3. Apply Extra Payment (if target debt)
```
extraPaymentAmount = min(extraPayment, remainingBalance)
newBalance = balance - extraPaymentAmount
```

### 4. Check if Paid Off
```
if (newBalance <= 0):
    debt is paid off
    add this debt's minimum to available extra payment
```

## Complete Example

**Initial State**:
- Credit Card: $3,000 @ 18% APR, $90 min
- Car Loan: $8,000 @ 6% APR, $250 min
- Student Loan: $12,000 @ 4% APR, $150 min
- Extra Payment: $200/month

### Snowball Method (Smallest Balance First)

**Order**: Credit Card → Car Loan → Student Loan

**Month 1**:
```
Credit Card:
  Interest: $3,000 × 0.18 / 12 = $45.00
  Minimum Principal: $90 - $45 = $45.00
  Extra: $200
  Total Principal: $245.00
  New Balance: $2,755.00

Car Loan:
  Interest: $8,000 × 0.06 / 12 = $40.00
  Minimum Principal: $250 - $40 = $210.00
  New Balance: $7,790.00

Student Loan:
  Interest: $12,000 × 0.04 / 12 = $40.00
  Minimum Principal: $150 - $40 = $110.00
  New Balance: $11,890.00
```

**Month 12** (approximately):
```
Credit Card: PAID OFF
Car Loan becomes new target (receives $290 extra)
```

### Avalanche Method (Highest Interest First)

**Order**: Credit Card → Car Loan → Student Loan
(Same order in this case, but would differ if APRs were different)

**Results would be identical since order is the same**

## Interest Savings Comparison

The app calculates:

**Total Interest Paid** = Sum of all interest payments across all months

**Interest Savings** = Snowball Total Interest - Avalanche Total Interest

**Time Savings** = Snowball Months - Avalanche Months

## Implementation Details

### Key Functions (lib/calculations/payoff.ts)

**calculateSnowball(debts, extraPayment)**
- Sorts debts by balance ascending
- Calls calculatePayoffStrategy()

**calculateAvalanche(debts, extraPayment)**
- Sorts debts by APR descending
- Calls calculatePayoffStrategy()

**calculatePayoffStrategy(sortedDebts, extraPayment, method)**
- Core algorithm for both methods
- Returns: monthlyPayments[], totalInterestPaid, monthsToPayoff

### Data Structures

**MonthlyPayment**:
```typescript
{
  month: number
  debtName: string
  payment: number
  principal: number
  interest: number
  remainingBalance: number
}
```

**PayoffStrategy**:
```typescript
{
  method: 'snowball' | 'avalanche'
  monthlyPayments: MonthlyPayment[]
  totalInterestPaid: number
  monthsToPayoff: number
  debtPayments: Array<{
    debtId: string
    debtName: string
    monthlyPayment: number
  }>
}
```

## Assumptions & Limitations

### Assumptions
1. **Fixed APR**: Interest rates don't change over time
2. **Consistent Payments**: Same extra payment every month
3. **No New Debt**: No additional charges to existing debts
4. **No Fees**: Late fees, annual fees not included
5. **Monthly Compounding**: Interest compounds monthly

### Safety Limits
- **Maximum Duration**: 600 months (50 years) to prevent infinite loops
- **Minimum Values**: All monetary values must be ≥ 0

### Edge Cases Handled
- **Zero Balance**: Debts marked as paid when balance ≤ 0
- **Insufficient Minimum Payment**: Ensures minimum ≥ interest
- **Payment Rollover**: When debt is paid off, minimum payment rolls to next target
- **Final Payment**: Ensures final payment doesn't exceed remaining balance

## Formula Reference

### Annual Percentage Rate (APR) to Monthly Rate
```
monthlyRate = APR / 100 / 12
```

### Monthly Interest Charge
```
interest = balance × monthlyRate
```

### Principal Paid
```
principal = payment - interest
```

### New Balance
```
newBalance = oldBalance - principal
```

### Total Interest (Sum across all payments)
```
totalInterest = Σ(monthly interest for all debts)
```

## Testing Your Calculations

To verify the calculator:

1. **Simple Case**: One debt, no extra payment
   - Should match standard amortization table

2. **Two Debts**: Different amounts, same APR
   - Snowball: Smallest balance first
   - Avalanche: Should be identical

3. **Two Debts**: Same amount, different APR
   - Snowball: Should be identical (same balance)
   - Avalanche: Highest APR first

4. **Edge Case**: Very small extra payment
   - Should still make progress
   - Check for rounding errors

## References

- [Debt Snowball Method](https://www.ramseysolutions.com/debt/how-the-debt-snowball-method-works)
- [Debt Avalanche Method](https://www.investopedia.com/terms/d/debt-avalanche.asp)
- Standard amortization formulas

## Contributing

If you find calculation errors or want to add features:
1. Add test cases for the new scenario
2. Update this documentation
3. Test with real-world debt examples
4. Verify against online calculators
