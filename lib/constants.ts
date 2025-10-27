/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// Toast notification settings
export const TOAST_DURATION_MS = 4000 // Auto-dismiss toasts after 4 seconds

// Password validation requirements
export const PASSWORD_MIN_LENGTH = 12
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 12,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
} as const

// Chart display settings
export const CHART_COLORS = {
  DEBT_PALETTE: [
    '#6366f1', // indigo
    '#ec4899', // pink
    '#10b981', // emerald
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ef4444', // red
  ],
  PRIMARY: '#6366f1', // indigo - used for total debt chart
} as const

// Chart dimensions
export const CHART_HEIGHT = {
  DEBT_PAYOFF: 400,
  TOTAL_DEBT: 300,
} as const

// Number formatting settings
export const CURRENCY_DECIMALS = 2
export const PERCENT_DECIMALS = 2

// Calculation constants
export const MONTHS_PER_YEAR = 12
export const MAX_PAYOFF_MONTHS = 1200 // 100 years max (safety limit)

// UI display constants
export const LOADING_TEXT = 'Loading...'
export const CALCULATING_TEXT = 'Calculating your payoff strategy...'
