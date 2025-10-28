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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <OnboardingWizard isOpen={showOnboarding} onClose={handleCloseOnboarding} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1.5">Dashboard</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Welcome back! Let's crush your debt together.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Debt</div>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(totalDebt)}
            </div>
            {debtCount > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                Across {debtCount} {debtCount === 1 ? 'debt' : 'debts'}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Active Debts</div>
            <div className="text-3xl font-bold text-foreground">{debtCount}</div>
            {debtCount > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                Highest APR: {formatPercent(highestAPR)}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Minimum Monthly</div>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(totalMinimumPayment)}
            </div>
            {currentExtraPayment > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                +{formatCurrency(currentExtraPayment)} extra payment
              </div>
            )}
          </div>
        </div>

        {/* Extra Payment Section */}
        {debtCount > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Extra Monthly Payment</h2>
              <p className="text-sm text-muted-foreground">
                Add extra to your minimum payment to pay off debt faster and save on interest.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-background border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-medium"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <button
                onClick={handleExtraPaymentUpdate}
                disabled={savingExtra || extraPayment === String(currentExtraPayment)}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {savingExtra ? 'Saving...' : 'Update'}
              </button>
            </div>

            {currentExtraPayment > 0 && (
              <div className="mt-4 p-4 bg-secondary rounded-md border border-border">
                <p className="text-sm text-foreground">
                  Total monthly payment: <strong>{formatCurrency(totalMinimumPayment + currentExtraPayment)}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  View your complete payoff strategy in the Results tab to see how much you'll save.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State or Debts List */}
        {debtCount === 0 ? (
          <div className="bg-card border border-border rounded-lg p-10 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-primary/10 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2 sm:mb-3">Ready to Start Your Journey?</h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Add your first debt to create a personalized payoff strategy and see when you'll be debt-free!
              </p>
              <Link
                href="/debts"
                className="inline-flex items-center bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg text-sm sm:text-base"
              >
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add Your First Debt
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Link>
              <button
                onClick={() => setShowOnboarding(true)}
                className="block mx-auto mt-4 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Show me how it works
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-card-foreground">Your Debts</h2>
              <Link
                href="/debts"
                className="text-primary hover:text-primary/80 font-medium text-sm flex items-center transition-colors"
              >
                Manage
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Debt Name
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-5 sm:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Min. Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {debts.map((debt) => (
                    <tr key={debt.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-card-foreground">
                        {debt.name}
                      </td>
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">
                        {formatCurrency(debt.balance)}
                      </td>
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-card-foreground">{formatPercent(debt.apr)}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${getAPRBadgeColor(debt.apr)}`}>
                            {getAPRBadgeLabel(debt.apr)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">
                        {formatCurrency(debt.minimum_payment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 sm:px-6 py-4 bg-muted/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-t border-border">
              {highestAPR >= 15 && (
                <div className="flex items-center text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>You have high-interest debt. Check your payoff strategy!</span>
                </div>
              )}
              <Link
                href="/results"
                className="sm:ml-auto bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center text-sm"
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
