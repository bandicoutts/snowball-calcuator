'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import DebtMethodInfo from '@/components/DebtMethodInfo'
import DebtPayoffChart from '@/components/charts/DebtPayoffChart'
import TotalDebtChart from '@/components/charts/TotalDebtChart'
import { calculatePayoffComparison } from '@/lib/calculations/payoff'
import { CalculationResult, Debt, MonthlyPayment } from '@/types/debt.types'
import { formatCurrency } from '@/lib/formatters'
import { Info, TrendingDown, Calculator, Clock, DollarSign } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<CalculationResult | null>(null)
  const [activeMethod, setActiveMethod] = useState<'snowball' | 'avalanche'>('snowball')
  const [showPaymentTable, setShowPaymentTable] = useState(false)
  const [showMethodInfo, setShowMethodInfo] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  const loadDataAndCalculate = useCallback(async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Load debts
    const { data: debtsData } = await supabase
      .from('debts')
      .select('*')
      .order('balance', { ascending: true })

    // Load settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!debtsData || debtsData.length === 0) {
      setLoading(false)
      return
    }

    const debts: Debt[] = debtsData.map((debt) => ({
      id: debt.id,
      name: debt.name,
      balance: Number(debt.balance),
      minimum_payment: Number(debt.minimum_payment),
      apr: Number(debt.apr),
    }))

    const extraPayment = settingsData ? Number(settingsData.extra_payment) : 0

    // Calculate payoff strategies
    const calculationResults = calculatePayoffComparison(debts, extraPayment)
    setResults(calculationResults)
    setLoading(false)
  }, [router, supabase])

  useEffect(() => {
    loadDataAndCalculate()
  }, [loadDataAndCalculate])

  const handleMethodToggle = (method: 'snowball' | 'avalanche') => {
    setActiveMethod(method)
  }

  const handleTogglePaymentTable = () => {
    setShowPaymentTable(prev => !prev)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32">
          <div className="flex items-center justify-center h-96">
            <div className="text-foreground-muted text-sm">Calculating your payoff strategy...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!results || results.debts.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32">
          <div className="card p-12 text-center">
            <h2 className="text-2xl font-medium text-foreground mb-3">No debts found</h2>
            <p className="text-foreground-muted mb-8">
              Add some debts first to see your payoff strategy
            </p>
            <Link
              href="/debts"
              className="btn-primary inline-flex items-center"
            >
              Add Debts
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const activeStrategy = results[activeMethod]
  const interestSavings = results.snowball.totalInterestPaid - results.avalanche.totalInterestPaid
  const timeSavings = results.snowball.monthsToPayoff - results.avalanche.monthsToPayoff

  return (
    <div className="min-h-screen">
      <Navbar />

      <DebtMethodInfo isOpen={showMethodInfo} onClose={() => setShowMethodInfo(false)} />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-medium text-foreground mb-2">Payoff Strategy Results</h1>
          <p className="text-base text-foreground-muted">
            Compare snowball and avalanche methods to find the best strategy for you
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
          <div className="card p-1.5 inline-flex gap-1.5">
            <button
              onClick={() => handleMethodToggle('snowball')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-md font-medium transition-all ${
                activeMethod === 'snowball'
                  ? 'bg-foreground text-background'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background-elevated'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Snowball</span>
            </button>
            <button
              onClick={() => handleMethodToggle('avalanche')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-md font-medium transition-all ${
                activeMethod === 'avalanche'
                  ? 'bg-foreground text-background'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background-elevated'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Avalanche</span>
            </button>
          </div>
          <button
            onClick={() => setShowMethodInfo(true)}
            className="flex items-center text-foreground hover:text-foreground-muted font-medium text-sm transition-colors"
          >
            <Info className="h-4 w-4 mr-2" />
            Learn about these methods
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Months to Payoff</div>
              <Clock className="h-5 w-5 text-foreground-subtle" />
            </div>
            <div className="text-3xl font-medium text-foreground mb-1">
              {activeStrategy.monthsToPayoff}
            </div>
            <p className="text-sm text-foreground-muted">
              {Math.floor(activeStrategy.monthsToPayoff / 12)} years{' '}
              {activeStrategy.monthsToPayoff % 12} months
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Total Interest Paid</div>
              <DollarSign className="h-5 w-5 text-foreground-subtle" />
            </div>
            <div className="text-3xl font-medium text-foreground mb-1">
              {formatCurrency(activeStrategy.totalInterestPaid)}
            </div>
            <p className="text-sm text-foreground-muted">
              Over the life of all debts
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Extra Monthly Payment</div>
              <DollarSign className="h-5 w-5 text-foreground-subtle" />
            </div>
            <div className="text-3xl font-medium text-foreground mb-1">
              {formatCurrency(results.extraPayment)}
            </div>
            <p className="text-sm text-foreground-muted">
              {results.extraPayment > 0 ? 'Accelerating payoff' : 'No extra payment set'}
            </p>
          </div>
        </div>

        {/* Comparison Card */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-medium text-foreground mb-8">Method Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-3">
                <TrendingDown className="h-5 w-5 text-foreground mr-3" />
                <h3 className="font-medium text-foreground">Snowball Method</h3>
              </div>
              <p className="text-sm text-foreground-muted mb-4">Pays smallest balance first for quick wins</p>
              <ul className="space-y-2 text-sm">
                <li className="text-foreground-muted">
                  <span className="font-medium text-foreground">Payoff Time:</span> {results.snowball.monthsToPayoff} months
                </li>
                <li className="text-foreground-muted">
                  <span className="font-medium text-foreground">Total Interest:</span> {formatCurrency(results.snowball.totalInterestPaid)}
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <Calculator className="h-5 w-5 text-foreground mr-3" />
                <h3 className="font-medium text-foreground">Avalanche Method</h3>
              </div>
              <p className="text-sm text-foreground-muted mb-4">Pays highest interest first to save money</p>
              <ul className="space-y-2 text-sm">
                <li className="text-foreground-muted">
                  <span className="font-medium text-foreground">Payoff Time:</span> {results.avalanche.monthsToPayoff} months
                </li>
                <li className="text-foreground-muted">
                  <span className="font-medium text-foreground">Total Interest:</span> {formatCurrency(results.avalanche.totalInterestPaid)}
                </li>
              </ul>
            </div>
          </div>

          {interestSavings !== 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">
                  {interestSavings > 0 ? (
                    <>
                      The avalanche method saves you {formatCurrency(Math.abs(interestSavings))} in interest
                      {timeSavings > 0 && ` and ${timeSavings} months`}
                    </>
                  ) : (
                    <>
                      The snowball method costs {formatCurrency(Math.abs(interestSavings))} more but may provide better motivation
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Payments */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-medium text-foreground mb-8">
            Recommended Monthly Payments ({activeMethod === 'snowball' ? 'Snowball' : 'Avalanche'})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeStrategy.debtPayments.map((payment) => (
              <div key={payment.debtId} className="border border-border rounded-lg p-6">
                <div className="font-medium text-foreground mb-3">{payment.debtName}</div>
                <div className="text-3xl font-medium text-foreground mb-1">
                  {formatCurrency(payment.monthlyPayment)}
                </div>
                <div className="text-sm text-foreground-muted">per month</div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Debt Over Time Chart */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-medium text-foreground mb-8">Total Debt Over Time</h2>
          <TotalDebtChart monthlyPayments={activeStrategy.monthlyPayments} />
        </div>

        {/* Individual Debt Payoff Chart */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-medium text-foreground mb-8">Individual Debt Payoff</h2>
          <DebtPayoffChart
            monthlyPayments={activeStrategy.monthlyPayments}
            debts={results.debts.map((d) => ({ id: d.id, name: d.name }))}
          />
        </div>

        {/* Payment Schedule Table */}
        <div className="card overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-medium text-foreground">Monthly Payment Schedule</h2>
            <button
              onClick={handleTogglePaymentTable}
              className="text-foreground hover:text-foreground-muted font-medium text-sm transition-colors"
            >
              {showPaymentTable ? 'Hide Table' : 'Show Table'}
            </button>
          </div>

          {showPaymentTable && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full">
                <thead className="border-b border-border bg-background sticky top-0">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Debt
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeStrategy.monthlyPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className={`border-b border-border hover:bg-background-elevated transition-colors ${
                        payment.remainingBalance === 0 ? 'bg-background-elevated' : ''
                      }`}
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-foreground-muted">
                        {payment.month}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {payment.debtName}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-foreground-muted font-medium">
                        {formatCurrency(payment.payment)}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-foreground-muted font-medium">
                        {formatCurrency(payment.principal)}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-foreground-muted font-medium">
                        {formatCurrency(payment.interest)}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-foreground-muted font-medium">
                        {formatCurrency(payment.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
