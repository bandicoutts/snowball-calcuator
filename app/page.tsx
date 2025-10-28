import Link from 'next/link';
import { ArrowRight, TrendingDown, Sparkles, Target, LineChart } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <Container size="lg">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <TrendingDown className="h-5 w-5 text-foreground transition-transform group-hover:-translate-y-0.5" />
              <span className="text-base font-medium text-foreground">Snowball</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn-primary text-sm inline-flex items-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-24">
        <Container size="md">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center card px-3 py-1.5 mb-12">
              <Sparkles className="h-3.5 w-3.5 text-foreground-muted mr-2" />
              <span className="text-xs font-medium text-foreground-muted tracking-wide">DEBT PAYOFF CALCULATOR</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-medium text-foreground mb-8 text-balance">
              Eliminate debt with precision
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              A sophisticated calculator that creates your personalized debt payoff strategy.
              See exactly when you'll be debt-free.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/signup" className="btn-primary inline-flex items-center">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="#features" className="btn-secondary inline-flex items-center">
                Learn more
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 max-w-xl mx-auto mt-20 pt-12 border-t border-border">
              <div>
                <div className="text-3xl font-medium text-foreground mb-1.5">$12K</div>
                <div className="text-xs text-foreground-muted uppercase tracking-wide">Avg. saved</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-foreground mb-1.5">3.2yr</div>
                <div className="text-xs text-foreground-muted uppercase tracking-wide">Faster payoff</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-foreground mb-1.5">50K+</div>
                <div className="text-xs text-foreground-muted uppercase tracking-wide">Users</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <Container size="lg">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              Everything you need
            </h2>
            <p className="text-base text-foreground-muted max-w-xl mx-auto">
              Powerful tools backed by financial science
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="card p-8">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-6 border border-border">
                <Target className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Smart Strategies
              </h3>
              <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                Compare Snowball and Avalanche methods. Get personalized recommendations for your situation.
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start text-sm text-foreground-muted">
                  <span className="text-foreground mr-2">—</span>
                  <span>Month-by-month breakdown</span>
                </li>
                <li className="flex items-start text-sm text-foreground-muted">
                  <span className="text-foreground mr-2">—</span>
                  <span>Interest savings calculator</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="card p-8">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-6 border border-border">
                <LineChart className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Visual Progress
              </h3>
              <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                Interactive charts show your progress. Watch your debt decrease with real-time visualizations.
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start text-sm text-foreground-muted">
                  <span className="text-foreground mr-2">—</span>
                  <span>Total debt timeline</span>
                </li>
                <li className="flex items-start text-sm text-foreground-muted">
                  <span className="text-foreground mr-2">—</span>
                  <span>Individual debt tracking</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="card p-8">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mb-6 border border-border">
                <TrendingDown className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Save Thousands
              </h3>
              <p className="text-sm text-foreground-muted leading-relaxed mb-4">
                Optimize payments to minimize interest and become debt-free years faster.
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start text-sm text-foreground-muted">
                  <span className="text-foreground mr-2">—</span>
                  <span>Minimize interest payments</span>
                </li>
                <li className="flex items-start text-sm text-foreground-muted">
                  <span className="text-foreground mr-2">—</span>
                  <span>Accelerate payoff timeline</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <Container size="md">
          <div className="card p-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-medium text-foreground mb-4">
              Ready to eliminate debt?
            </h2>
            <p className="text-base text-foreground-muted max-w-lg mx-auto mb-8">
              Join thousands who've taken control of their finances. Create your personalized plan in under 2 minutes.
            </p>
            <Link href="/signup" className="btn-primary inline-flex items-center">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <p className="mt-6 text-xs text-foreground-muted uppercase tracking-wide">
              No credit card required
            </p>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
