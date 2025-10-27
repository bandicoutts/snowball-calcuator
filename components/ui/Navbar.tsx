'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { LayoutDashboard, CreditCard, BarChart3, LogOut, Menu, X, TrendingDown } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])
  const { showSuccess, showError } = useToast()
  const [loggingOut, setLoggingOut] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [debtCount, setDebtCount] = useState(0)

  useEffect(() => {
    loadDebtCount()
  }, [])

  const loadDebtCount = async () => {
    const { data: debts } = await supabase.from('debts').select('id')
    setDebtCount(debts?.length || 0)
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        showError('Failed to log out. Please try again.')
        return
      }

      showSuccess('Successfully logged out')
      router.push('/')
      router.refresh()
    } catch (err) {
      showError('An unexpected error occurred')
    } finally {
      setLoggingOut(false)
    }
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      enabled: true,
    },
    {
      name: 'Manage Debts',
      href: '/debts',
      icon: CreditCard,
      enabled: true,
      badge: debtCount > 0 ? debtCount : null,
    },
    {
      name: 'Results',
      href: '/results',
      icon: BarChart3,
      enabled: debtCount > 0,
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="border-b border-white/10 backdrop-blur-xl bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Snowball</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : item.enabled
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!item.enabled) {
                        e.preventDefault()
                        showError('Please add at least one debt first')
                      }
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center space-x-2 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-4 w-4" />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : item.enabled
                      ? 'text-slate-300 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!item.enabled) {
                      e.preventDefault()
                      showError('Please add at least one debt first')
                    } else {
                      setMobileMenuOpen(false)
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              disabled={loggingOut}
              className="w-full flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-base font-medium transition-all disabled:opacity-50"
            >
              <LogOut className="h-5 w-5" />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
