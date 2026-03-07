import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client with env-provided URL and anonymous key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
