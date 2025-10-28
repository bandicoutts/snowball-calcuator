'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/Toast'
import { LayoutDashboard, CreditCard, BarChart3, LogOut, Menu, X, TrendingDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-10">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-foreground" />
              <span className="text-base font-semibold text-foreground">Snowball</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-foreground bg-secondary'
                        : item.enabled
                        ? 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        : 'text-muted-foreground/40 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!item.enabled) {
                        e.preventDefault()
                        showError('Please add at least one debt first')
                      }
                    }}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-1 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : item.enabled
                      ? 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      : 'text-muted-foreground/40 cursor-not-allowed'
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
                  <div className="flex items-center space-x-2.5">
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-1.5 py-0.5 rounded-md">
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
              className="w-full flex items-center space-x-2.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
