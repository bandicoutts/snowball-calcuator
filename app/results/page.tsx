'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/ui/Navbar'
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Calculating your payoff strategy...</div>
        </div>
      </div>
    )
  }

  if (!results || results.debts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No debts found</h2>
            <p className="text-gray-600 mb-6">
              Add some debts first to see your payoff strategy.
            </p>
            <Link
              href="/debts"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <DebtMethodInfo isOpen={showMethodInfo} onClose={() => setShowMethodInfo(false)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payoff Strategy Results</h1>
          <p className="text-lg text-gray-600">
            Compare snowball and avalanche methods to find the best strategy for you.
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex">
            <button
              onClick={() => handleMethodToggle('snowball')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeMethod === 'snowball'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>Snowball</span>
            </button>
            <button
              onClick={() => handleMethodToggle('avalanche')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeMethod === 'avalanche'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>Avalanche</span>
            </button>
          </div>
          <button
            onClick={() => setShowMethodInfo(true)}
            className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            <Info className="h-4 w-4 mr-1" />
            Learn about these methods
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Months to Payoff</div>
                <div className="text-3xl font-bold text-gray-900">
                  {activeStrategy.monthsToPayoff}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  ({Math.floor(activeStrategy.monthsToPayoff / 12)} years{' '}
                  {activeStrategy.monthsToPayoff % 12} months)
                </div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Interest Paid</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(activeStrategy.totalInterestPaid)}
                </div>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Extra Monthly Payment</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(results.extraPayment)}
                </div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow p-6 mb-8 border-2 border-indigo-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Method Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Snowball Method</h3>
              <p className="text-sm text-gray-600 mb-3">Pays smallest balance first for quick wins</p>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Payoff Time:</span> {results.snowball.monthsToPayoff} months
                </li>
                <li>
                  <span className="font-medium">Total Interest:</span> {formatCurrency(results.snowball.totalInterestPaid)}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Avalanche Method</h3>
              <p className="text-sm text-gray-600 mb-3">Pays highest interest first to save money</p>
              <ul className="space-y-1 text-sm">
                <li>
                  <span className="font-medium">Payoff Time:</span> {results.avalanche.monthsToPayoff} months
                </li>
                <li>
                  <span className="font-medium">Total Interest:</span> {formatCurrency(results.avalanche.totalInterestPaid)}
                </li>
              </ul>
            </div>
          </div>

          {interestSavings !== 0 && (
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm font-medium text-gray-900">
                {interestSavings > 0 ? (
                  <>
                    💰 The avalanche method saves you {formatCurrency(Math.abs(interestSavings))} in interest
                    {timeSavings > 0 && ` and ${timeSavings} months`}!
                  </>
                ) : (
                  <>
                    The snowball method costs {formatCurrency(Math.abs(interestSavings))} more but may provide better motivation.
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Recommended Payments */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recommended Monthly Payments ({activeMethod === 'snowball' ? 'Snowball' : 'Avalanche'})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStrategy.debtPayments.map((payment) => (
              <div key={payment.debtId} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900">{payment.debtName}</div>
                <div className="text-2xl font-bold text-indigo-600 mt-2">
                  {formatCurrency(payment.monthlyPayment)}
                </div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Debt Over Time Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Debt Over Time</h2>
          <TotalDebtChart monthlyPayments={activeStrategy.monthlyPayments} />
        </div>

        {/* Individual Debt Payoff Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Individual Debt Payoff</h2>
          <DebtPayoffChart
            monthlyPayments={activeStrategy.monthlyPayments}
            debts={results.debts.map((d) => ({ id: d.id, name: d.name }))}
          />
        </div>

        {/* Payment Schedule Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Payment Schedule</h2>
            <button
              onClick={handleTogglePaymentTable}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              {showPaymentTable ? 'Hide Table' : 'Show Table'}
            </button>
          </div>

          {showPaymentTable && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeStrategy.monthlyPayments.map((payment, index) => (
                    <tr key={index} className={payment.remainingBalance === 0 ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.debtName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(payment.payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(payment.principal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(payment.interest)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
