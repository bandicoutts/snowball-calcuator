'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, TrendingDown, DollarSign, Brain, Calculator } from 'lucide-react'

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Understanding Debt Payoff Methods
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Snowball Method */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 rounded-lg p-3 mr-4">
                        <TrendingDown className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Snowball Method</h3>
                    </div>

                    <p className="text-gray-700 mb-4">
                      Pay off debts from <strong>smallest balance to largest</strong>, regardless of interest rate.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start">
                          <Brain className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Pros</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Quick wins boost motivation</li>
                              <li>• Eliminates accounts faster</li>
                              <li>• Psychological momentum</li>
                              <li>• Simplifies your finances sooner</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Cons</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• May pay more interest overall</li>
                              <li>• High-rate debts grow longer</li>
                              <li>• Not mathematically optimal</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-100 rounded-lg p-3">
                      <p className="text-sm text-blue-900">
                        <strong>Best for:</strong> People who need motivation and quick wins. If you've struggled with debt before, the psychological boost can be powerful.
                      </p>
                    </div>
                  </div>

                  {/* Avalanche Method */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-600 rounded-lg p-3 mr-4">
                        <Calculator className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">Avalanche Method</h3>
                    </div>

                    <p className="text-gray-700 mb-4">
                      Pay off debts from <strong>highest interest rate to lowest</strong>, regardless of balance.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start">
                          <DollarSign className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Pros</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Saves the most money</li>
                              <li>• Mathematically optimal</li>
                              <li>• Minimizes total interest paid</li>
                              <li>• Often faster payoff time</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start">
                          <Brain className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Cons</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Slower initial progress</li>
                              <li>• Can feel less rewarding</li>
                              <li>• Requires discipline</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-100 rounded-lg p-3">
                      <p className="text-sm text-green-900">
                        <strong>Best for:</strong> Financially disciplined people who want to save the most money. If you're motivated by numbers and optimization, this is your method.
                      </p>
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 px-2 font-medium text-gray-700">Debt</th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700">Balance</th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700">APR</th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700">Snowball Order</th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700">Avalanche Order</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600">
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-2">Credit Card A</td>
                            <td className="py-2 px-2">$1,000</td>
                            <td className="py-2 px-2">22%</td>
                            <td className="py-2 px-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">1st</span></td>
                            <td className="py-2 px-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">1st</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-2">Personal Loan</td>
                            <td className="py-2 px-2">$5,000</td>
                            <td className="py-2 px-2">8%</td>
                            <td className="py-2 px-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">3rd</span></td>
                            <td className="py-2 px-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">3rd</span></td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-2">Credit Card B</td>
                            <td className="py-2 px-2">$3,000</td>
                            <td className="py-2 px-2">18%</td>
                            <td className="py-2 px-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">2nd</span></td>
                            <td className="py-2 px-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">2nd</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      In this example, both methods happen to align. In many cases they'll differ significantly.
                    </p>
                  </div>

                  {/* Bottom CTA */}
                  <div className="bg-indigo-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Which Method Should You Choose?</h3>
                    <p className="text-indigo-100 mb-4">
                      The best method is the one you'll stick with! Our calculator shows you both so you can compare and decide.
                      Many people find that the avalanche method saves more money, but if you need motivation, snowball might be better.
                    </p>
                    <p className="text-indigo-100 text-sm">
                      💡 <strong>Pro tip:</strong> Try a hybrid approach - start with snowball to build momentum, then switch to avalanche once you've eliminated a few debts.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Got It!
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
