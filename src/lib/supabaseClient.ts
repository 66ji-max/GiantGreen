import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseClientConfigured = Boolean(
  supabaseUrl &&
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().startsWith('http') &&
    supabaseAnonKey &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 10
);

/**
 * Browser-safe Supabase client using ONLY the public Anon Key.
 * Used strictly for administrator authentication at /admin/login.
 * Secret / Service Role keys are NEVER exposed to the browser.
 */
export const supabase: SupabaseClient | null = isSupabaseClientConfigured
  ? createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
