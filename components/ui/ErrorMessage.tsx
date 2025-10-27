/**
 * Reusable error message component
 */

import Link from 'next/link'

interface ErrorMessageProps {
  title?: string
  message: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  fullScreen?: boolean
}

export default function ErrorMessage({
  title = 'Error',
  message,
  action,
  fullScreen = false
}: ErrorMessageProps) {
  const content = (
    <div className="bg-white rounded-lg shadow p-8 max-w-md">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
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

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        {content}
      </div>
    )
  }

  return content
}
