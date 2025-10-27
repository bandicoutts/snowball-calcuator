import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/ui/Navbar'
import { formatCurrency, formatPercent } from '@/lib/formatters'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's debts
  const { data: debts } = await supabase
    .from('debts')
    .select('*')
    .order('balance', { ascending: true })

  // Fetch user settings
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const totalDebt = debts?.reduce((sum, debt) => sum + Number(debt.balance), 0) || 0
  const totalMinimumPayment = debts?.reduce((sum, debt) => sum + Number(debt.minimum_payment), 0) || 0
  const debtCount = debts?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your debt overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Debt</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(totalDebt)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Number of Debts</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{debtCount}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Minimum Monthly Payment</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {formatCurrency(totalMinimumPayment)}
            </div>
          </div>
        </div>

        {debtCount === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No debts yet</h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your debts to see your payoff strategy.
            </p>
            <Link
              href="/debts"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Add Your First Debt
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Debts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min. Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {debts?.map((debt) => (
                    <tr key={debt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {debt.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(Number(debt.balance))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatPercent(Number(debt.apr))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(Number(debt.minimum_payment))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
              <Link
                href="/debts"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Manage Debts
              </Link>
              <Link
                href="/results"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
              >
                View Payoff Strategy
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
