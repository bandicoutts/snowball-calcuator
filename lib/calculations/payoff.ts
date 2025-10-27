import { Debt, MonthlyPayment, PayoffStrategy, CalculationResult } from '@/types/debt.types'

/**
 * Calculate monthly interest payment for a debt
 */
function calculateMonthlyInterest(balance: number, apr: number): number {
  const monthlyRate = apr / 100 / 12
  return balance * monthlyRate
}

/**
 * Calculate debt payoff using the snowball method (smallest balance first)
 */
export function calculateSnowball(debts: Debt[], extraPayment: number): PayoffStrategy {
  // Sort debts by balance (smallest first) for snowball method
  const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance)

  return calculatePayoffStrategy(sortedDebts, extraPayment, 'snowball')
}

/**
 * Calculate debt payoff using the avalanche method (highest APR first)
 */
export function calculateAvalanche(debts: Debt[], extraPayment: number): PayoffStrategy {
  // Sort debts by APR (highest first) for avalanche method
  const sortedDebts = [...debts].sort((a, b) => b.apr - a.apr)

  return calculatePayoffStrategy(sortedDebts, extraPayment, 'avalanche')
}

/**
 * Core calculation logic for both methods
 */
function calculatePayoffStrategy(
  sortedDebts: Debt[],
  extraPayment: number,
  method: 'snowball' | 'avalanche'
): PayoffStrategy {
  const monthlyPayments: MonthlyPayment[] = []
  let totalInterestPaid = 0
  let month = 0
  const maxMonths = 600 // 50 years safety limit

  // Create working copy of debts with current balances
  const workingDebts = sortedDebts.map(debt => ({
    ...debt,
    currentBalance: debt.balance,
    isPaidOff: false,
  }))

  // Calculate total minimum payment
  const totalMinimumPayment = workingDebts.reduce((sum, debt) => sum + debt.minimum_payment, 0)
  const totalAvailablePayment = totalMinimumPayment + extraPayment

  // Continue until all debts are paid off
  while (workingDebts.some(debt => !debt.isPaidOff) && month < maxMonths) {
    month++

    // Calculate how much extra payment we have this month
    let remainingExtraPayment = extraPayment

    // Pay minimum on all debts and track interest
    for (const debt of workingDebts) {
      if (debt.isPaidOff) continue

      const monthlyInterest = calculateMonthlyInterest(debt.currentBalance, debt.apr)
      const minimumPayment = Math.min(debt.minimum_payment, debt.currentBalance + monthlyInterest)
      const principalFromMinimum = minimumPayment - monthlyInterest

      debt.currentBalance -= principalFromMinimum
      totalInterestPaid += monthlyInterest

      monthlyPayments.push({
        month,
        debtName: debt.name,
        payment: minimumPayment,
        principal: principalFromMinimum,
        interest: monthlyInterest,
        remainingBalance: Math.max(0, debt.currentBalance),
      })

      if (debt.currentBalance <= 0) {
        debt.isPaidOff = true
        // Add this debt's minimum payment to extra payment for next debts
        remainingExtraPayment += debt.minimum_payment
      }
    }

    // Apply extra payment to the first non-paid-off debt (already sorted by method)
    if (remainingExtraPayment > 0) {
      const targetDebt = workingDebts.find(debt => !debt.isPaidOff)

      if (targetDebt) {
        const extraPaymentAmount = Math.min(remainingExtraPayment, targetDebt.currentBalance)
        targetDebt.currentBalance -= extraPaymentAmount

        // Find the existing payment record and update it
        const existingPayment = monthlyPayments.find(
          p => p.month === month && p.debtName === targetDebt.name
        )

        if (existingPayment) {
          existingPayment.payment += extraPaymentAmount
          existingPayment.principal += extraPaymentAmount
          existingPayment.remainingBalance = Math.max(0, targetDebt.currentBalance)
        }

        if (targetDebt.currentBalance <= 0) {
          targetDebt.isPaidOff = true
        }
      }
    }
  }

  // Calculate payment amounts per debt for the first month (for display purposes)
  const debtPayments = sortedDebts.map(debt => {
    const isFirst = debt.id === sortedDebts[0].id
    const payment = debt.minimum_payment + (isFirst ? extraPayment : 0)

    return {
      debtId: debt.id,
      debtName: debt.name,
      monthlyPayment: payment,
    }
  })

  return {
    method,
    monthlyPayments,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    monthsToPayoff: month,
    debtPayments,
  }
}

/**
 * Calculate both snowball and avalanche methods and return comparison
 */
export function calculatePayoffComparison(
  debts: Debt[],
  extraPayment: number
): CalculationResult {
  const snowball = calculateSnowball(debts, extraPayment)
  const avalanche = calculateAvalanche(debts, extraPayment)

  return {
    snowball,
    avalanche,
    debts,
    extraPayment,
  }
}
