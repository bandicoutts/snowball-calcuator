'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OnboardingWizard from '@/components/OnboardingWizard';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { DollarSign, CreditCard, TrendingDown, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Debt {
  id: string;
  name: string;
  balance: number;
  minimum_payment: number;
  apr: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [extraPayment, setExtraPayment] = useState('');
  const [currentExtraPayment, setCurrentExtraPayment] = useState(0);
  const [savingExtra, setSavingExtra] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // Load debts
    const { data: debtsData } = await supabase
      .from('debts')
      .select('*')
      .order('apr', { ascending: false });

    if (debtsData) {
      const mappedDebts = debtsData.map((debt) => ({
        ...debt,
        balance: Number(debt.balance),
        minimum_payment: Number(debt.minimum_payment),
        apr: Number(debt.apr),
      }));
      setDebts(mappedDebts);

      if (mappedDebts.length === 0) {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }
    }

    // Load settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsData) {
      setCurrentExtraPayment(Number(settingsData.extra_payment));
      setExtraPayment(String(settingsData.extra_payment));
    } else {
      await supabase
        .from('user_settings')
        .insert({ user_id: user.id, extra_payment: 0 });
    }

    setLoading(false);
  };

  const handleExtraPaymentUpdate = async () => {
    setSavingExtra(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showError('You must be logged in');
      setSavingExtra(false);
      return;
    }

    const newAmount = parseFloat(extraPayment) || 0;

    const { error } = await supabase
      .from('user_settings')
      .update({ extra_payment: newAmount })
      .eq('user_id', user.id);

    if (error) {
      showError(`Failed to save: ${error.message}`);
      setSavingExtra(false);
      return;
    }

    setCurrentExtraPayment(newAmount);
    showSuccess('Extra payment updated successfully!');
    setSavingExtra(false);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimum_payment, 0);
  const debtCount = debts.length;
  const highestAPR = debts.length > 0 ? Math.max(...debts.map(d => d.apr)) : 0;

  // Calculate estimated debt-free date (simplified)
  const estimatedMonths = totalDebt > 0 && (totalMinimumPayment + currentExtraPayment) > 0
    ? Math.ceil(totalDebt / (totalMinimumPayment + currentExtraPayment))
    : 0;
  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + estimatedMonths);

  const getAPRBadgeColor = (apr: number) => {
    if (apr >= 15) return 'text-red-400';
    if (apr >= 8) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Container className="pt-24">
          <div className="flex items-center justify-center h-96">
            <div className="text-foreground-muted">Loading your dashboard...</div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <OnboardingWizard isOpen={showOnboarding} onClose={handleCloseOnboarding} />

      <Container className="pt-28 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-2">Dashboard</h1>
          <p className="text-lg text-foreground-muted">Your path to financial freedom</p>
        </div>

        {debtCount === 0 ? (
          /* Empty State */
          <div className="glass p-12 md:p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Ready to start your journey?
            </h2>
            <p className="text-foreground-muted mb-8 max-w-md mx-auto">
              Add your first debt to create a personalized payoff strategy and see when you'll be debt-free.
            </p>
            <Link href="/debts" className="btn-primary">
              <CreditCard className="h-4 w-4 mr-2" />
              Add your first debt
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <button
              onClick={() => setShowOnboarding(true)}
              className="block mx-auto mt-4 text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Show me how it works
            </button>
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total Debt */}
              <div className="glass p-6 md:p-7 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-foreground-muted">Total Debt</div>
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-foreground">
                  {formatCurrency(totalDebt)}
                </div>
                <p className="text-sm text-foreground-muted mt-2">
                  Across {debtCount} {debtCount === 1 ? 'debt' : 'debts'}
                </p>
              </div>

              {/* Debt-Free Date */}
              <div className="glass p-6 md:p-7 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-foreground-muted">Debt-Free Date</div>
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-foreground">
                  {estimatedMonths > 0 ? debtFreeDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </div>
                <p className="text-sm text-foreground-muted mt-2">
                  {estimatedMonths > 0 ? `${estimatedMonths} months away` : 'Add payment info'}
                </p>
              </div>

              {/* Next Payment */}
              <div className="glass p-6 md:p-7 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-foreground-muted">Next Payment</div>
                  <TrendingDown className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-foreground">
                  {formatCurrency(totalMinimumPayment + currentExtraPayment)}
                </div>
                <p className="text-sm text-foreground-muted mt-2">
                  Due {new Date(new Date().setDate(1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              {/* Minimum Monthly */}
              <div className="glass p-6 md:p-7 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-foreground-muted">Minimum Monthly</div>
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-foreground">
                  {formatCurrency(totalMinimumPayment)}
                </div>
                <p className="text-sm text-foreground-muted mt-2">
                  {currentExtraPayment > 0 ? `+${formatCurrency(currentExtraPayment)} extra` : 'No extra payment'}
                </p>
              </div>
            </div>

            {/* Extra Payment Card */}
            <div className="glass p-6 md:p-8 mb-12">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Extra Monthly Payment
                </h2>
                <p className="text-sm text-foreground-muted">
                  Add extra to your minimum payment to pay off debt faster and save on interest.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 max-w-md">
                <Input
                  label="Amount"
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                />
                <Button
                  onClick={handleExtraPaymentUpdate}
                  disabled={savingExtra || extraPayment === String(currentExtraPayment)}
                  variant="primary"
                  className="sm:mb-0"
                >
                  {savingExtra ? 'Saving...' : 'Update'}
                </Button>
              </div>

              {currentExtraPayment > 0 && (
                <div className="mt-6 p-4 bg-white/[0.04] rounded-lg border border-white/10">
                  <p className="text-sm text-foreground">
                    Total monthly payment: <strong>{formatCurrency(totalMinimumPayment + currentExtraPayment)}</strong>
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    View your complete payoff strategy in the Results tab to see how much you'll save.
                  </p>
                </div>
              )}
            </div>

            {/* Debts Table */}
            <div className="glass overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Your Debts</h2>
                <Link
                  href="/debts"
                  className="text-sm font-medium text-accent hover:text-accent-2 transition-colors flex items-center"
                >
                  Manage
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                        Debt Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                        APR
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                        Min. Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {debts.map((debt, index) => (
                      <tr
                        key={debt.id}
                        className={`border-b border-white/[0.05] hover:bg-white/[0.04] transition-colors ${
                          index % 2 === 1 ? 'bg-white/[0.02]' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                          {debt.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted font-medium">
                          {formatCurrency(debt.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${getAPRBadgeColor(debt.apr)}`}>
                            {formatPercent(debt.apr)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-muted font-medium">
                          {formatCurrency(debt.minimum_payment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                {highestAPR >= 15 && (
                  <div className="flex items-center text-sm text-yellow-400">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>You have high-interest debt. Check your payoff strategy!</span>
                  </div>
                )}
                <Link
                  href="/results"
                  className="btn-primary text-sm sm:ml-auto"
                >
                  View Payoff Strategy
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </>
        )}
      </Container>

      <Footer />
    </div>
  );
}
