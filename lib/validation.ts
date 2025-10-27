import { PASSWORD_REQUIREMENTS } from './constants'

/**
 * Sanitize user input to prevent XSS attacks
 * Uses simple sanitization that works in both server and client
 */
export function sanitizeInput(input: string): string {
  // Remove HTML tags and trim whitespace
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, '') // Remove potentially dangerous characters
    .trim()
}

/**
 * Password validation utility
 */
export interface PasswordValidationResult {
  valid: boolean
  error?: string
}

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters` }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' }
  }

  return { valid: true }
}

/**
 * Email validation utility
 */
export function validateEmail(email: string): PasswordValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }

  return { valid: true }
}
