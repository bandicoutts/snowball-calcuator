'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import Navbar from '@/components/ui/Navbar'
import OnboardingWizard from '@/components/OnboardingWizard'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { DollarSign, CreditCard, TrendingDown, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'

interface Debt {
  id: string
  name: string
  balance: number
  minimum_payment: number
  apr: number
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [debts, setDebts] = useState<Debt[]>([])
  const [extraPayment, setExtraPayment] = useState('')
  const [currentExtraPayment, setCurrentExtraPayment] = useState(0)
  const [savingExtra, setSavingExtra] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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
      .order('apr', { ascending: false })

    if (debtsData) {
      const mappedDebts = debtsData.map((debt) => ({
        ...debt,
        balance: Number(debt.balance),
        minimum_payment: Number(debt.minimum_payment),
        apr: Number(debt.apr),
      }))
      setDebts(mappedDebts)

      // Show onboarding if this is first visit (no debts)
      if (mappedDebts.length === 0) {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
        if (!hasSeenOnboarding) {
          setShowOnboarding(true)
        }
      }
    }

    // Load settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (settingsData) {
      setCurrentExtraPayment(Number(settingsData.extra_payment))
      setExtraPayment(String(settingsData.extra_payment))
    } else {
      // Create default settings
      await supabase
        .from('user_settings')
        .insert({ user_id: user.id, extra_payment: 0 })
    }

    setLoading(false)
  }

  const handleExtraPaymentUpdate = async () => {
    setSavingExtra(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      showError('You must be logged in')
      setSavingExtra(false)
      return
    }

    const newAmount = parseFloat(extraPayment) || 0

    const { error } = await supabase
      .from('user_settings')
      .update({ extra_payment: newAmount })
      .eq('user_id', user.id)

    if (error) {
      showError(`Failed to save: ${error.message}`)
      setSavingExtra(false)
      return
    }

    setCurrentExtraPayment(newAmount)
    showSuccess('Extra payment updated successfully!')
    setSavingExtra(false)
  }

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0)
  const debtCount = debts.length
  const highestAPR = debts.length > 0 ? Math.max(...debts.map(d => d.apr)) : 0

  const getAPRBadgeColor = (apr: number) => {
    if (apr >= 15) return 'bg-red-100 text-red-700 border-red-200'
    if (apr >= 8) return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getAPRBadgeLabel = (apr: number) => {
    if (apr >= 15) return 'High APR'
    if (apr >= 8) return 'Medium APR'
    return 'Low APR'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <OnboardingWizard isOpen={showOnboarding} onClose={handleCloseOnboarding} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Let's crush your debt together.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Debt</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalDebt)}
                </div>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Number of Debts</div>
                <div className="text-3xl font-bold text-gray-900">{debtCount}</div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Minimum Monthly</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalMinimumPayment)}
                </div>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <TrendingDown className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Payment Section - Prominent Position */}
        {debtCount > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-start mb-4">
              <Sparkles className="h-6 w-6 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Accelerate Your Debt Payoff</h2>
                <p className="text-green-100">
                  Adding even a small extra payment each month can save you thousands in interest and years of debt!
                </p>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
              <label className="block text-sm font-semibold mb-3">
                How much extra can you pay each month?
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-xs">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-white font-semibold">$</span>
                    <input
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-lg text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-30 font-semibold text-lg"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <button
                  onClick={handleExtraPaymentUpdate}
                  disabled={savingExtra || extraPayment === String(currentExtraPayment)}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {savingExtra ? 'Saving...' : 'Update'}
                </button>
              </div>

              {currentExtraPayment > 0 && (
                <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm font-medium">
                    💰 With ${formatCurrency(currentExtraPayment).replace('$', '')} extra per month, you'll pay{' '}
                    <strong>${formatCurrency(totalMinimumPayment + currentExtraPayment).replace('$', '')} total</strong> each month.
                  </p>
                  <p className="text-xs text-green-100 mt-2">
                    View your complete payoff strategy in the Results tab to see how much you'll save!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State or Debts List */}
        {debtCount === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start Your Journey?</h2>
              <p className="text-gray-600 mb-8">
                Add your first debt to create a personalized payoff strategy and see when you'll be debt-free!
              </p>
              <Link
                href="/debts"
                className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg text-lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Add Your First Debt
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <button
                onClick={() => setShowOnboarding(true)}
                className="block mx-auto mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Show me how it works
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">Your Debts</h2>
              <Link
                href="/debts"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
              >
                Manage
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Debt Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Min. Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {debts.map((debt) => (
                    <tr key={debt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {debt.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {formatCurrency(debt.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{formatPercent(debt.apr)}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getAPRBadgeColor(debt.apr)}`}>
                            {getAPRBadgeLabel(debt.apr)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {formatCurrency(debt.minimum_payment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center border-t border-gray-200">
              {highestAPR >= 15 && (
                <div className="flex items-center text-sm text-amber-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>You have high-interest debt. Check your payoff strategy!</span>
                </div>
              )}
              <Link
                href="/results"
                className="ml-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md flex items-center"
              >
                View Payoff Strategy
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
