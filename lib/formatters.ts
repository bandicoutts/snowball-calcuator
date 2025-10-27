import { CURRENCY_DECIMALS, PERCENT_DECIMALS } from './constants'

/**
 * Formatting utility functions for consistent display across the application
 */

/**
 * Format a number as US currency with configured decimal places
 * @param amount - The number to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: CURRENCY_DECIMALS,
    maximumFractionDigits: CURRENCY_DECIMALS
  })}`
}

/**
 * Format a number as a percentage with configured decimal places
 * @param rate - The number to format (e.g., 18.99 for 18.99%)
 * @returns Formatted percentage string (e.g., "18.99%")
 */
export function formatPercent(rate: number): string {
  return `${rate.toFixed(PERCENT_DECIMALS)}%`
}

/**
 * Format a number with thousand separators and decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: currency decimals)
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(value: number, decimals: number = CURRENCY_DECIMALS): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}
