'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import Navbar from '@/components/ui/Navbar'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Tooltip from '@/components/ui/Tooltip'
import { sanitizeInput } from '@/lib/validation'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { CreditCard, Plus, Edit, Trash2, Check, X, AlertTriangle } from 'lucide-react'

interface Debt {
  id: string
  name: string
  balance: number
  minimum_payment: number
  apr: number
}

interface FormErrors {
  name?: string
  balance?: string
  minimum_payment?: string
  apr?: string
}

interface FormWarnings {
  balance?: string
  minimum_payment?: string
  apr?: string
}

export default function DebtsPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { showSuccess, showError } = useToast()
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [debtToDelete, setDebtToDelete] = useState<{ id: string; name: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    minimum_payment: '',
    apr: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [formWarnings, setFormWarnings] = useState<FormWarnings>({})
  const [touched, setTouched] = useState({
    name: false,
    balance: false,
    minimum_payment: false,
    apr: false,
  })

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
      setDebts(debtsData.map(debt => ({
        ...debt,
        balance: Number(debt.balance),
        minimum_payment: Number(debt.minimum_payment),
        apr: Number(debt.apr),
      })))
    }

    setLoading(false)
  }

  // Real-time validation
  const validateField = (name: string, value: string) => {
    const errors: FormErrors = {}
    const warnings: FormWarnings = {}

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Debt name is required'
        } else if (value.length > 100) {
          errors.name = 'Name must be less than 100 characters'
        }
        break

      case 'balance':
        const balance = parseFloat(value)
        if (!value) {
          errors.balance = 'Balance is required'
        } else if (isNaN(balance) || balance < 0) {
          errors.balance = 'Balance must be a positive number'
        } else if (balance > 1000000) {
          warnings.balance = 'This is a very large balance. Please double-check.'
        } else if (balance < 10) {
          warnings.balance = 'This balance seems unusually low'
        }
        break

      case 'minimum_payment':
        const minPayment = parseFloat(value)
        const currentBalance = parseFloat(formData.balance)
        if (!value) {
          errors.minimum_payment = 'Minimum payment is required'
        } else if (isNaN(minPayment) || minPayment < 0) {
          errors.minimum_payment = 'Payment must be a positive number'
        } else if (currentBalance && minPayment > currentBalance) {
          errors.minimum_payment = 'Payment cannot exceed balance'
        } else if (currentBalance && minPayment > currentBalance * 0.10) {
          warnings.minimum_payment = 'This seems high. Most minimums are 2-5% of balance'
        } else if (currentBalance && minPayment < currentBalance * 0.01) {
          warnings.minimum_payment = 'This seems low. Check your statement'
        }
        break

      case 'apr':
        const apr = parseFloat(value)
        if (!value) {
          errors.apr = 'APR is required'
        } else if (isNaN(apr) || apr < 0) {
          errors.apr = 'APR must be a positive number'
        } else if (apr > 100) {
          errors.apr = 'APR cannot exceed 100%'
        } else if (apr > 30) {
          warnings.apr = 'This APR is very high. Please double-check.'
        } else if (apr > 25) {
          warnings.apr = 'This is a high interest rate'
        }
        break
    }

    return { errors, warnings }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Validate on change
    const { errors, warnings } = validateField(name, value)
    setFormErrors(prev => ({ ...prev, [name]: errors[name as keyof FormErrors] }))
    setFormWarnings(prev => ({ ...prev, [name]: warnings[name as keyof FormWarnings] }))
  }

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true })
  }

  const validateForm = () => {
    const errors: FormErrors = {}
    const warnings: FormWarnings = {}

    Object.keys(formData).forEach(key => {
      const { errors: fieldErrors, warnings: fieldWarnings } = validateField(key, formData[key as keyof typeof formData])
      if (fieldErrors[key as keyof FormErrors]) {
        errors[key as keyof FormErrors] = fieldErrors[key as keyof FormErrors]
      }
      if (fieldWarnings[key as keyof FormWarnings]) {
        warnings[key as keyof FormWarnings] = fieldWarnings[key as keyof FormWarnings]
      }
    })

    setFormErrors(errors)
    setFormWarnings(warnings)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showError('Please fix the errors before submitting')
      return
    }

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
      const { error } = await supabase
        .from('debts')
        .update(debtData)
        .eq('id', editingDebt.id)

      if (error) {
        showError(`Failed to update: ${error.message}`)
        return
      }
      showSuccess('Debt updated successfully!')
    } else {
      const { error } = await supabase.from('debts').insert([debtData])

      if (error) {
        showError(`Failed to add debt: ${error.message}`)
        return
      }
      showSuccess('Debt added successfully!')
    }

    resetForm()
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

  const confirmDelete = (id: string, debtName: string) => {
    setDebtToDelete({ id, name: debtName })
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!debtToDelete) return

    setDeletingId(debtToDelete.id)

    const { error } = await supabase.from('debts').delete().eq('id', debtToDelete.id)

    if (error) {
      showError(`Failed to delete debt: ${error.message}`)
      setDeletingId(null)
      return
    }

    showSuccess('Debt deleted successfully')
    setDeletingId(null)
    setDeleteDialogOpen(false)
    setDebtToDelete(null)
    loadData()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingDebt(null)
    setFormData({ name: '', balance: '', minimum_payment: '', apr: '' })
    setFormErrors({})
    setFormWarnings({})
    setTouched({ name: false, balance: false, minimum_payment: false, apr: false })
  }

  const getAPRBadgeColor = (apr: number) => {
    if (apr >= 15) return 'bg-red-100 text-red-700 border-red-200'
    if (apr >= 8) return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getAPRBadgeLabel = (apr: number) => {
    if (apr >= 15) return 'High'
    if (apr >= 8) return 'Medium'
    return 'Low'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDebtToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Delete Debt?"
        message={`Are you sure you want to delete "${debtToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deletingId !== null}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Debts</h1>
            <p className="text-lg text-gray-600">Track all your debts in one place</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Debt
          </button>
        </div>

        {/* Add/Edit Debt Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingDebt ? 'Edit Debt' : 'Add New Debt'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Debt Name */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Debt Name
                  <Tooltip content="Give this debt a recognizable name, like 'Chase Credit Card' or 'Student Loan'">
                    <span className="ml-2" />
                  </Tooltip>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    touched.name && formErrors.name
                      ? 'border-red-300 focus:border-red-500'
                      : touched.name && !formErrors.name
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-gray-300 focus:border-indigo-500'
                  }`}
                  placeholder="e.g., Credit Card, Student Loan"
                />
                {touched.name && !formErrors.name && formData.name && (
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Looks good!
                  </div>
                )}
                {touched.name && formErrors.name && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <X className="h-4 w-4 mr-1" />
                    {formErrors.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Balance
                    <Tooltip content="The total amount you currently owe on this debt">
                      <span className="ml-2" />
                    </Tooltip>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('balance')}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        touched.balance && formErrors.balance
                          ? 'border-red-300 focus:border-red-500'
                          : touched.balance && !formErrors.balance && !formWarnings.balance
                          ? 'border-green-300 focus:border-green-500'
                          : formWarnings.balance
                          ? 'border-amber-300 focus:border-amber-500'
                          : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      placeholder="5000.00"
                    />
                  </div>
                  {touched.balance && !formErrors.balance && !formWarnings.balance && formData.balance && (
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Valid
                    </div>
                  )}
                  {touched.balance && formErrors.balance && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <X className="h-4 w-4 mr-1" />
                      {formErrors.balance}
                    </div>
                  )}
                  {touched.balance && formWarnings.balance && !formErrors.balance && (
                    <div className="flex items-center mt-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {formWarnings.balance}
                    </div>
                  )}
                </div>

                {/* Minimum Payment */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    Minimum Payment
                    <Tooltip content="The minimum amount you must pay each month (check your statement)">
                      <span className="ml-2" />
                    </Tooltip>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="minimum_payment"
                      value={formData.minimum_payment}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('minimum_payment')}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        touched.minimum_payment && formErrors.minimum_payment
                          ? 'border-red-300 focus:border-red-500'
                          : touched.minimum_payment && !formErrors.minimum_payment && !formWarnings.minimum_payment
                          ? 'border-green-300 focus:border-green-500'
                          : formWarnings.minimum_payment
                          ? 'border-amber-300 focus:border-amber-500'
                          : 'border-gray-300 focus:border-indigo-500'
                      }`}
                      placeholder="100.00"
                    />
                  </div>
                  {touched.minimum_payment && !formErrors.minimum_payment && !formWarnings.minimum_payment && formData.minimum_payment && (
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Valid
                    </div>
                  )}
                  {touched.minimum_payment && formErrors.minimum_payment && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <X className="h-4 w-4 mr-1" />
                      {formErrors.minimum_payment}
                    </div>
                  )}
                  {touched.minimum_payment && formWarnings.minimum_payment && !formErrors.minimum_payment && (
                    <div className="flex items-center mt-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {formWarnings.minimum_payment}
                    </div>
                  )}
                </div>

                {/* APR */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    APR (%)
                    <Tooltip content="Annual Percentage Rate - the yearly interest rate on this debt. Find this on your statement.">
                      <span className="ml-2" />
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    name="apr"
                    value={formData.apr}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('apr')}
                    step="0.01"
                    min="0"
                    max="100"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      touched.apr && formErrors.apr
                        ? 'border-red-300 focus:border-red-500'
                        : touched.apr && !formErrors.apr && !formWarnings.apr
                        ? 'border-green-300 focus:border-green-500'
                        : formWarnings.apr
                        ? 'border-amber-300 focus:border-amber-500'
                        : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    placeholder="18.99"
                  />
                  {touched.apr && !formErrors.apr && !formWarnings.apr && formData.apr && (
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Valid
                    </div>
                  )}
                  {touched.apr && formErrors.apr && (
                    <div className="flex items-center mt-2 text-sm text-red-600">
                      <X className="h-4 w-4 mr-1" />
                      {formErrors.apr}
                    </div>
                  )}
                  {touched.apr && formWarnings.apr && !formErrors.apr && (
                    <div className="flex items-center mt-2 text-sm text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {formWarnings.apr}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  {editingDebt ? 'Update Debt' : 'Add Debt'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Debts List */}
        {debts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Debts Added Yet</h2>
            <p className="text-gray-600 mb-6">
              Click "Add Debt" to get started with your payoff plan!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Debt Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Min. Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      APR
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {debts.map((debt) => (
                    <tr key={debt.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {debt.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {formatCurrency(debt.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {formatCurrency(debt.minimum_payment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{formatPercent(debt.apr)}</span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getAPRBadgeColor(debt.apr)}`}>
                            {getAPRBadgeLabel(debt.apr)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleEdit(debt)}
                          disabled={deletingId === debt.id}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 disabled:opacity-50 font-semibold"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(debt.id, debt.name)}
                          disabled={deletingId !== null}
                          className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50 font-semibold"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
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
