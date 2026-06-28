import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL?.trim() || ""
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim() || ""

const missingVars: string[] = []
if (!supabaseUrl) missingVars.push("SUPABASE_URL")
if (!supabaseAnonKey) missingVars.push("SUPABASE_ANON_KEY")

if (missingVars.length > 0 && typeof window === "undefined") {
  console.warn(`[Supabase] Missing ${missingVars.join(", ")} — Supabase client unavailable.`)
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function isSupabaseAvailable(): boolean {
  return !!supabase
}
