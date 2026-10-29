// Supabase-klient för frontend. Endast publik nyckel (SEC-005, PP-019).
// FEAT-001. Om miljövariablerna saknas returneras null, och appen visar ett fel i stället för att låtsas fungera.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export const authConfigured = supabase !== null;
