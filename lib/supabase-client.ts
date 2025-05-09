import { createClient } from "@supabase/supabase-js"

// Singleton pattern for Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL and Anon Key must be provided")
      throw new Error("Supabase URL and Anon Key must be provided")
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Disable session persistence for better SSR compatibility
        },
        global: {
          fetch: (...args) => {
            return fetch(...args)
          },
        },
      })
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      throw error
    }
  }
  return supabaseClient
}

// Initialize supabase client
export const supabase = getSupabaseClient()
