import Link from 'next/link'
import { TrendingDown, Calculator, DollarSign, BarChart3, CheckCircle, Sparkles, ArrowRight, Shield, Zap, Target } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Snowball</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-slate-300 hover:text-white font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI-Powered Debt Elimination Strategy</span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Become Debt-Free
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Years Faster
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Smart algorithms analyze your debts and create a personalized payoff strategy that saves you thousands in interest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
            >
              Start Your Free Plan
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$12K</div>
              <div className="text-sm text-slate-400">Avg. Interest Saved</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl font-bold text-white mb-1">3.2 Years</div>
              <div className="text-sm text-slate-400">Faster Debt-Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-slate-400">Users Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to Win
          </h2>
          <p className="text-xl text-slate-400">
            Powerful tools backed by financial science
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Strategies</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Compare Snowball and Avalanche methods side-by-side. Our algorithm recommends the optimal approach for your situation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                  <span>Personalized payment plans</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                  <span>Month-by-month breakdown</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                  <span>Interest savings calculator</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Visual Insights</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Beautiful, interactive charts show your progress. Watch your debt shrink in real-time with data-driven visualizations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                  <span>Total debt timeline</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                  <span>Individual debt tracking</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                  <span>Progress milestones</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Save Thousands</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Our users save an average of $12,000 in interest and become debt-free 3+ years sooner than traditional methods.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                  <span>Minimize interest payments</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                  <span>Accelerate payoff timeline</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                  <span>Track your savings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Three Simple Steps
          </h2>
          <p className="text-xl text-slate-400">
            Get your personalized plan in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-600 mb-4">
                01
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Add Your Debts</h3>
              <p className="text-slate-400 leading-relaxed">
                Enter your debt balances, interest rates, and minimum payments. Our secure platform keeps your data private.
              </p>
            </div>
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-600 mb-4">
                02
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Set Extra Payment</h3>
              <p className="text-slate-400 leading-relaxed">
                Tell us how much extra you can afford. Even $50/month makes a massive difference in your payoff timeline.
              </p>
            </div>
            <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 mb-4">
                03
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Watch Debt Disappear</h3>
              <p className="text-slate-400 leading-relaxed">
                See your personalized plan with exact payoff dates, interest savings, and monthly payment schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Bank-Level Security</div>
                <div className="text-sm text-slate-400">256-bit encryption</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Lightning Fast</div>
                <div className="text-sm text-slate-400">Results in seconds</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Proven Results</div>
                <div className="text-sm text-slate-400">50K+ success stories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-24">
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Become Debt-Free?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands who've taken control of their finances. Start your free plan today—no credit card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105"
            >
              Create Your Free Plan
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <p className="mt-6 text-sm text-indigo-200">
              Free forever • No credit card • 2 minute setup
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-slate-950/50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Snowball</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2025 Snowball Debt Calculator. Your path to financial freedom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
