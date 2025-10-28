'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Target, TrendingDown, Calculator, DollarSign, BarChart3, Check, Lightbulb } from 'lucide-react'
import Link from 'next/link'

interface OnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to Your Debt-Free Journey',
      icon: Target,
      content: (
        <div className="space-y-6">
          <p className="text-foreground-muted">
            We're here to help you take control of your debt and create a clear path to financial freedom.
          </p>
          <p className="text-foreground-muted">
            This quick tour will show you how to:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">Add your debts and track them in one place</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">Choose the best payoff strategy for you</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">See exactly when you'll be debt-free</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-foreground-muted">Save thousands in interest payments</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Two Proven Debt Payoff Methods',
      icon: TrendingDown,
      content: (
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mr-3 border border-border">
                <TrendingDown className="h-5 w-5 text-foreground" />
              </div>
              <h4 className="font-medium text-foreground">Snowball Method</h4>
            </div>
            <p className="text-sm text-foreground-muted">
              Pay off <strong className="text-foreground">smallest debts first</strong> for quick wins and motivation. Great for building momentum.
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mr-3 border border-border">
                <Calculator className="h-5 w-5 text-foreground" />
              </div>
              <h4 className="font-medium text-foreground">Avalanche Method</h4>
            </div>
            <p className="text-sm text-foreground-muted">
              Pay off <strong className="text-foreground">highest interest rates first</strong> to save the most money. Mathematically optimal.
            </p>
          </div>

          <div className="card p-4 flex items-start">
            <Lightbulb className="h-5 w-5 text-foreground-muted mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground-muted">
              <strong className="text-foreground">Don't worry!</strong> You'll see both methods compared side-by-side so you can choose what works best for you.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'How the Calculator Works',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center mr-4 flex-shrink-0 border border-border">
                <span className="text-foreground font-medium text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Add Your Debts</h4>
                <p className="text-sm text-foreground-muted">
                  Enter each debt's balance, minimum payment, and interest rate (APR)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center mr-4 flex-shrink-0 border border-border">
                <span className="text-foreground font-medium text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Set Extra Payment</h4>
                <p className="text-sm text-foreground-muted">
                  Tell us how much extra you can pay each month (even $25 helps!)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center mr-4 flex-shrink-0 border border-border">
                <span className="text-foreground font-medium text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">View Your Strategy</h4>
                <p className="text-sm text-foreground-muted">
                  See your personalized payoff plan with charts, timelines, and recommended payments
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 flex items-start">
            <DollarSign className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground-muted">
              <strong className="text-foreground">Real Results:</strong> Our users typically save $5,000-$15,000 in interest and become debt-free 2-5 years sooner.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Ready to Start?',
      icon: Target,
      content: (
        <div className="space-y-6">
          <p className="text-foreground-muted text-lg">
            You're all set! Here's what to do next:
          </p>

          <div className="card p-6">
            <h4 className="font-medium text-foreground mb-4">Your Next Steps:</h4>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center mr-3 flex-shrink-0 text-sm font-medium">1</span>
                <div>
                  <p className="font-medium text-foreground">Add your first debt</p>
                  <p className="text-sm text-foreground-muted">Start with your credit card or largest debt</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center mr-3 flex-shrink-0 text-sm font-medium">2</span>
                <div>
                  <p className="font-medium text-foreground">Set your extra payment amount</p>
                  <p className="text-sm text-foreground-muted">Even $50/month makes a big difference</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center mr-3 flex-shrink-0 text-sm font-medium">3</span>
                <div>
                  <p className="font-medium text-foreground">View your payoff strategy</p>
                  <p className="text-sm text-foreground-muted">Compare methods and see when you'll be debt-free</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex justify-center">
            <Link
              href="/debts"
              onClick={onClose}
              className="btn-primary inline-flex items-center"
            >
              Add Your First Debt
            </Link>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-background-elevated border border-border shadow-premium transition-all">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center mr-4 border border-border">
                        <StepIcon className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-medium text-foreground">
                          {currentStepData.title}
                        </Dialog.Title>
                        <p className="text-foreground-muted text-sm mt-1">
                          Step {currentStep + 1} of {steps.length}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-foreground-muted hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-border h-1">
                  <div
                    className="bg-foreground h-1 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>

                {/* Content */}
                <div className="px-8 py-8">
                  {currentStepData.content}
                </div>

                {/* Footer */}
                <div className="bg-background px-8 py-6 flex justify-between items-center border-t border-border">
                  <button
                    onClick={onClose}
                    className="text-foreground-muted hover:text-foreground text-sm font-medium transition-colors"
                  >
                    Skip Tour
                  </button>

                  <div className="flex space-x-3">
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn-secondary"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="btn-primary"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="btn-primary"
                      >
                        Let's Go!
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
