'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Sparkles, TrendingDown, Calculator, DollarSign, BarChart3 } from 'lucide-react'
import Link from 'next/link'

interface OnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to Your Debt-Free Journey!',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We're here to help you take control of your debt and create a clear path to financial freedom.
          </p>
          <p className="text-gray-700">
            This quick tour will show you how to:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Add your debts and track them in one place
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Choose the best payoff strategy for you
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              See exactly when you'll be debt-free
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              Save thousands in interest payments
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
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-center mb-2">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Snowball Method</h4>
            </div>
            <p className="text-sm text-gray-700">
              Pay off <strong>smallest debts first</strong> for quick wins and motivation. Great for building momentum!
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center mb-2">
              <div className="bg-green-600 rounded-lg p-2 mr-3">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Avalanche Method</h4>
            </div>
            <p className="text-sm text-gray-700">
              Pay off <strong>highest interest rates first</strong> to save the most money. Mathematically optimal!
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-sm text-indigo-900">
              💡 <strong>Don't worry!</strong> You'll see both methods compared side-by-side so you can choose what works best for you.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'How the Calculator Works',
      icon: BarChart3,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-lg p-2 mr-3 flex-shrink-0">
                <span className="text-indigo-700 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Add Your Debts</h4>
                <p className="text-sm text-gray-600">
                  Enter each debt's balance, minimum payment, and interest rate (APR)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-lg p-2 mr-3 flex-shrink-0">
                <span className="text-indigo-700 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Set Extra Payment</h4>
                <p className="text-sm text-gray-600">
                  Tell us how much extra you can pay each month (even $25 helps!)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-lg p-2 mr-3 flex-shrink-0">
                <span className="text-indigo-700 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">View Your Strategy</h4>
                <p className="text-sm text-gray-600">
                  See your personalized payoff plan with charts, timelines, and recommended payments
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <strong className="text-green-700">Real Results:</strong> Our users typically save $5,000-$15,000 in interest and become debt-free 2-5 years sooner!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Ready to Start?',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-lg">
            You're all set! Here's what to do next:
          </p>

          <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Your Next Steps:</h4>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">1</span>
                <div>
                  <p className="font-medium text-gray-900">Add your first debt</p>
                  <p className="text-sm text-gray-600">Start with your credit card or largest debt</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">2</span>
                <div>
                  <p className="font-medium text-gray-900">Set your extra payment amount</p>
                  <p className="text-sm text-gray-600">Even $50/month makes a big difference</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">3</span>
                <div>
                  <p className="font-medium text-gray-900">View your payoff strategy</p>
                  <p className="text-sm text-gray-600">Compare methods and see when you'll be debt-free</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex justify-center">
            <Link
              href="/debts"
              onClick={onClose}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg"
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
          <div className="fixed inset-0 bg-black bg-opacity-30" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                        <StepIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <Dialog.Title className="text-2xl font-bold">
                          {currentStepData.title}
                        </Dialog.Title>
                        <p className="text-indigo-100 text-sm mt-1">
                          Step {currentStep + 1} of {steps.length}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white hover:text-indigo-100"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-200 h-2">
                  <div
                    className="bg-indigo-600 h-2 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>

                {/* Content */}
                <div className="px-6 py-8">
                  {currentStepData.content}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Skip Tour
                  </button>

                  <div className="flex space-x-3">
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                      >
                        Back
                      </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
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
