import Link from 'next/link'
import { TrendingDown, Calculator, DollarSign, BarChart3, CheckCircle, Sparkles, ArrowRight, Shield, Zap, Target } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-foreground" />
              <span className="text-base font-semibold text-foreground">Snowball</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 sm:pt-32 pb-16">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            Eliminate debt.<br />Build wealth.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A smart calculator that creates your personalized debt payoff strategy. See exactly when you'll be debt-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Get started
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center text-foreground px-5 py-2.5 rounded-md font-medium text-sm hover:bg-secondary transition-colors"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          {/* Feature 1 */}
          <div>
            <Calculator className="h-5 w-5 text-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Strategies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compare Snowball and Avalanche methods to find the optimal approach for your situation.
            </p>
          </div>

          {/* Feature 2 */}
          <div>
            <BarChart3 className="h-5 w-5 text-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Visual Progress</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interactive charts show exactly when you'll be debt-free and how much you'll save.
            </p>
          </div>

          {/* Feature 3 */}
          <div>
            <DollarSign className="h-5 w-5 text-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Save Money</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Optimize your payments to minimize interest and become debt-free years faster.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center border border-border rounded-lg p-12 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start eliminating debt today
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
            Create your personalized payoff plan in under 2 minutes. Free forever.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Get started
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Snowball</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Snowball. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
