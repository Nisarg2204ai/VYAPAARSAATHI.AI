'use client';
import { supabase } from './supabase';

export interface DatabaseAdapter {
  isSupabaseConfigured: boolean;
  isNeonConfigured: boolean;
  activeProvider: 'supabase' | 'neon' | 'local';
}

export function getDatabaseAdapter(): DatabaseAdapter {
  const isSupabaseConfigured = Boolean(supabase);
  const isNeonConfigured = Boolean(process.env.NEXT_PUBLIC_NEON_DATABASE_URL);

  let activeProvider: 'supabase' | 'neon' | 'local' = 'local';
  if (isSupabaseConfigured) {
    activeProvider = 'supabase';
  } else if (isNeonConfigured) {
    activeProvider = 'neon';
  }

  return {
    isSupabaseConfigured,
    isNeonConfigured,
    activeProvider,
  };
}
