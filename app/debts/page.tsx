'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import Navbar from '@/components/ui/Navbar'
import { sanitizeInput } from '@/lib/validation'
import { formatCurrency, formatPercent } from '@/lib/formatters'

interface Debt {
  id: string
  name: string
  balance: number
  minimum_payment: number
  apr: number
}

interface UserSettings {
  extra_payment: number
}

export default function DebtsPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { showSuccess, showError } = useToast()
  const [debts, setDebts] = useState<Debt[]>([])
  const [settings, setSettings] = useState<UserSettings>({ extra_payment: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savingExtra, setSavingExtra] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    minimum_payment: '',
    apr: '',
  })

  const [extraPayment, setExtraPayment] = useState('')

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
      .order('balance', { ascending: true })

    if (debtsData) {
      setDebts(debtsData.map(debt => ({
        ...debt,
        balance: Number(debt.balance),
        minimum_payment: Number(debt.minimum_payment),
        apr: Number(debt.apr),
      })))
    }

    // Load settings
    const { data: settingsData } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (settingsData) {
      setSettings({
        extra_payment: Number(settingsData.extra_payment),
      })
      setExtraPayment(String(settingsData.extra_payment))
    } else {
      // Create default settings
      await supabase
        .from('user_settings')
        .insert({ user_id: user.id, extra_payment: 0 })
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const debtData = {
      user_id: user.id,
      name: sanitizeInput(formData.name),
      balance: parseFloat(formData.balance),
      minimum_payment: parseFloat(formData.minimum_payment),
      apr: parseFloat(formData.apr),
    }

    if (editingDebt) {
      // Update existing debt
      const { error } = await supabase
        .from('debts')
        .update(debtData)
        .eq('id', editingDebt.id)

      if (error) {
        setError(error.message)
        return
      }
    } else {
      // Insert new debt
      const { error } = await supabase.from('debts').insert([debtData])

      if (error) {
        setError(error.message)
        return
      }
    }

    // Reset form
    setFormData({ name: '', balance: '', minimum_payment: '', apr: '' })
    setShowForm(false)
    setEditingDebt(null)
    loadData()
  }

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
    setFormData({
      name: debt.name,
      balance: String(debt.balance),
      minimum_payment: String(debt.minimum_payment),
      apr: String(debt.apr),
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string, debtName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${debtName}"? This action cannot be undone.`)
    if (!confirmed) return

    setDeletingId(id)

    const { error } = await supabase.from('debts').delete().eq('id', id)

    if (error) {
      showError(`Failed to delete debt: ${error.message}`)
      setDeletingId(null)
      return
    }

    showSuccess('Debt deleted successfully')
    setDeletingId(null)
    loadData()
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

    const { error } = await supabase
      .from('user_settings')
      .update({ extra_payment: parseFloat(extraPayment) || 0 })
      .eq('user_id', user.id)

    if (error) {
      showError(`Failed to save: ${error.message}`)
      setSavingExtra(false)
      return
    }

    setSettings({ extra_payment: parseFloat(extraPayment) || 0 })
    showSuccess('Extra payment updated successfully!')
    setSavingExtra(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingDebt(null)
    setFormData({ name: '', balance: '', minimum_payment: '', apr: '' })
    setError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Debts</h1>
            <p className="text-gray-600 mt-2">Add, edit, or remove your debts.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Debt
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Extra Payment Setting */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Extra Monthly Payment</h2>
          <p className="text-sm text-gray-600 mb-4">
            How much extra can you pay toward your debts each month? This will be applied to your target debt.
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <button
              onClick={handleExtraPaymentUpdate}
              disabled={savingExtra}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingExtra ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Add/Edit Debt Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingDebt ? 'Edit Debt' : 'Add New Debt'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Debt Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                  placeholder="e.g., Credit Card, Student Loan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Balance ($)
                  </label>
                  <input
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="5000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Payment ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minimum_payment}
                    onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="100.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    APR (%)
                  </label>
                  <input
                    type="number"
                    value={formData.apr}
                    onChange={(e) => setFormData({ ...formData, apr: e.target.value })}
                    required
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900"
                    placeholder="18.99"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {editingDebt ? 'Update Debt' : 'Add Debt'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Debts List */}
        {debts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No debts added yet. Click "Add Debt" to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      Min. Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {debts.map((debt) => (
                    <tr key={debt.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {debt.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(debt.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(debt.minimum_payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatPercent(debt.apr)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                        <button
                          onClick={() => handleEdit(debt)}
                          disabled={deletingId === debt.id}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(debt.id, debt.name)}
                          disabled={deletingId !== null}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === debt.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
