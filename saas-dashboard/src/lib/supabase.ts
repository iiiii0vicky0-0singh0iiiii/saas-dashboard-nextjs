import { createClient } from "@supabase/supabase-js";

// These values come from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create and export Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
