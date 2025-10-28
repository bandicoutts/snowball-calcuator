'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, TrendingDown, DollarSign, Brain, Calculator, Lightbulb } from 'lucide-react'

interface DebtMethodInfoProps {
  isOpen: boolean
  onClose: () => void
}

export default function DebtMethodInfo({ isOpen, onClose }: DebtMethodInfoProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-background-elevated border border-border shadow-premium transition-all p-8">
                <div className="flex justify-between items-start mb-8">
                  <Dialog.Title className="text-2xl font-medium text-foreground">
                    Understanding Debt Payoff Methods
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Snowball Method */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mr-4 border border-border">
                        <TrendingDown className="h-5 w-5 text-foreground" />
                      </div>
                      <h3 className="text-xl font-medium text-foreground">Snowball Method</h3>
                    </div>

                    <p className="text-foreground-muted mb-6">
                      Pay off debts from <strong className="text-foreground">smallest balance to largest</strong>, regardless of interest rate.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-background rounded-lg p-4 border border-border">
                        <div className="flex items-start">
                          <Brain className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Pros</h4>
                            <ul className="text-sm text-foreground-muted space-y-1.5">
                              <li>Quick wins boost motivation</li>
                              <li>Eliminates accounts faster</li>
                              <li>Psychological momentum</li>
                              <li>Simplifies your finances sooner</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-4 border border-border">
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Cons</h4>
                            <ul className="text-sm text-foreground-muted space-y-1.5">
                              <li>May pay more interest overall</li>
                              <li>High-rate debts grow longer</li>
                              <li>Not mathematically optimal</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="text-sm text-foreground-muted">
                        <strong className="text-foreground">Best for:</strong> People who need motivation and quick wins. If you've struggled with debt before, the psychological boost can be powerful.
                      </p>
                    </div>
                  </div>

                  {/* Avalanche Method */}
                  <div className="card p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center mr-4 border border-border">
                        <Calculator className="h-5 w-5 text-foreground" />
                      </div>
                      <h3 className="text-xl font-medium text-foreground">Avalanche Method</h3>
                    </div>

                    <p className="text-foreground-muted mb-6">
                      Pay off debts from <strong className="text-foreground">highest interest rate to lowest</strong>, regardless of balance.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-background rounded-lg p-4 border border-border">
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Pros</h4>
                            <ul className="text-sm text-foreground-muted space-y-1.5">
                              <li>Saves the most money</li>
                              <li>Mathematically optimal</li>
                              <li>Minimizes total interest paid</li>
                              <li>Often faster payoff time</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-4 border border-border">
                        <div className="flex items-start">
                          <Brain className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Cons</h4>
                            <ul className="text-sm text-foreground-muted space-y-1.5">
                              <li>Slower initial progress</li>
                              <li>Can feel less rewarding</li>
                              <li>Requires discipline</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-4 border border-border">
                      <p className="text-sm text-foreground-muted">
                        <strong className="text-foreground">Best for:</strong> Financially disciplined people who want to save the most money. If you're motivated by numbers and optimization, this is your method.
                      </p>
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="card p-6">
                    <h3 className="text-lg font-medium text-foreground mb-6">Example Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-3 font-medium text-foreground-muted">Debt</th>
                            <th className="text-left py-3 px-3 font-medium text-foreground-muted">Balance</th>
                            <th className="text-left py-3 px-3 font-medium text-foreground-muted">APR</th>
                            <th className="text-left py-3 px-3 font-medium text-foreground-muted">Snowball Order</th>
                            <th className="text-left py-3 px-3 font-medium text-foreground-muted">Avalanche Order</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground-muted">
                          <tr className="border-b border-border">
                            <td className="py-3 px-3">Credit Card A</td>
                            <td className="py-3 px-3">$1,000</td>
                            <td className="py-3 px-3">22%</td>
                            <td className="py-3 px-3"><span className="bg-background-elevated text-foreground px-2 py-1 rounded border border-border">1st</span></td>
                            <td className="py-3 px-3"><span className="bg-background-elevated text-foreground px-2 py-1 rounded border border-border">1st</span></td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-3 px-3">Personal Loan</td>
                            <td className="py-3 px-3">$5,000</td>
                            <td className="py-3 px-3">8%</td>
                            <td className="py-3 px-3"><span className="bg-background-elevated text-foreground px-2 py-1 rounded border border-border">3rd</span></td>
                            <td className="py-3 px-3"><span className="bg-background-elevated text-foreground px-2 py-1 rounded border border-border">3rd</span></td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-3 px-3">Credit Card B</td>
                            <td className="py-3 px-3">$3,000</td>
                            <td className="py-3 px-3">18%</td>
                            <td className="py-3 px-3"><span className="bg-background-elevated text-foreground px-2 py-1 rounded border border-border">2nd</span></td>
                            <td className="py-3 px-3"><span className="bg-background-elevated text-foreground px-2 py-1 rounded border border-border">2nd</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-foreground-subtle mt-4">
                      In this example, both methods happen to align. In many cases they'll differ significantly.
                    </p>
                  </div>

                  {/* Bottom CTA */}
                  <div className="card p-6 bg-background">
                    <h3 className="text-lg font-medium text-foreground mb-3">Which Method Should You Choose?</h3>
                    <p className="text-foreground-muted mb-4">
                      The best method is the one you'll stick with! Our calculator shows you both so you can compare and decide.
                      Many people find that the avalanche method saves more money, but if you need motivation, snowball might be better.
                    </p>
                    <div className="flex items-start">
                      <Lightbulb className="h-5 w-5 text-foreground mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground-muted">
                        <strong className="text-foreground">Pro tip:</strong> Try a hybrid approach - start with snowball to build momentum, then switch to avalanche once you've eliminated a few debts.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Got It
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
