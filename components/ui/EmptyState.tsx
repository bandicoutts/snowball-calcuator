/**
 * Reusable empty state component
 */

import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  message: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export default function EmptyState({
  icon,
  title,
  message,
  action
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {action && (
        <div className="flex justify-center">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
