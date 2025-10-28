'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { TrendingDown, LogOut, Menu, X } from 'lucide-react';
import { Container } from './ui/Container';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const { showSuccess, showError } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [debtCount, setDebtCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    loadDebtCount();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadDebtCount = async () => {
    const { data: debts } = await supabase.from('debts').select('id');
    setDebtCount(debts?.length || 0);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        showError('Failed to log out. Please try again.');
        return;
      }

      showSuccess('Successfully logged out');
      router.push('/');
      router.refresh();
    } catch (err) {
      showError('An unexpected error occurred');
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', enabled: true },
    { name: 'Debts', href: '/debts', enabled: true, badge: debtCount > 0 ? debtCount : null },
    { name: 'Results', href: '/results', enabled: debtCount > 0 },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/40 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <Container>
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <TrendingDown className="h-5 w-5 text-accent group-hover:text-accent-light transition-colors" />
            <span className="text-lg font-semibold text-foreground">Snowball</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-foreground bg-white/[0.08]'
                    : item.enabled
                    ? 'text-foreground-muted hover:text-foreground hover:bg-white/[0.04]'
                    : 'text-foreground-muted/40 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!item.enabled) {
                    e.preventDefault();
                    showError('Please add at least one debt first');
                  }
                }}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-accent text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center space-x-2 text-foreground-muted hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl">
          <Container>
            <div className="py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-foreground bg-white/[0.08]'
                      : item.enabled
                      ? 'text-foreground-muted hover:text-foreground hover:bg-white/[0.04]'
                      : 'text-foreground-muted/40 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!item.enabled) {
                      e.preventDefault();
                      showError('Please add at least one debt first');
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                disabled={loggingOut}
                className="w-full flex items-center space-x-2 text-foreground-muted hover:text-foreground hover:bg-white/[0.04] px-4 py-3 rounded-lg text-base font-medium transition-colors disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" />
                <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
