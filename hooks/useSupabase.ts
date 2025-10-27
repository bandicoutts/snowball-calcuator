'use client'

import { createClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

/**
 * Custom hook to get Supabase client
 * Memoizes the client to avoid recreating on every render
 */
export function useSupabase() {
  const supabase = useMemo(() => createClient(), [])
  return supabase
}
