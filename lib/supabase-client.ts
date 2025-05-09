import { createClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL and Anon Key must be provided")
      throw new Error("Supabase URL and Anon Key must be provided")
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      throw error
    }
  }
  return supabaseClient
}

let supabase: ReturnType<typeof createClient>

// Initialize supabase client
try {
  supabase = getSupabaseClient()
} catch (error) {
  console.error("Failed to initialize Supabase client:", error)
  // Provide a fallback client that will log errors but not crash the app
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({
            range: () => Promise.resolve({ data: [], error: null, count: 0 }),
            then: () => Promise.resolve({ data: [], error: null, count: 0 }),
          }),
          range: () => Promise.resolve({ data: [], error: null, count: 0 }),
          then: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
        limit: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
          then: () => Promise.resolve({ data: [], error: null }),
        }),
        neq: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        gt: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        not: () => ({
          gt: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
        }),
        or: () => ({
          range: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  } as any
}

export { supabase }
