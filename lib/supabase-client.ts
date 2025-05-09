import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL veya Anon Key bulunamadı. Lütfen .env.local dosyasını kontrol edin veya çevre değişkenlerini ayarlayın.",
  )
}

let supabaseClient: ReturnType<typeof createClient> | null = null

// Export the getSupabaseClient function for backward compatibility
export function getSupabaseClient() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL ve Anon Key sağlanmalıdır")
      throw new Error("Supabase URL ve Anon Key sağlanmalıdır")
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
        },
      })
      console.log("Supabase client başarıyla oluşturuldu")
    } catch (error) {
      console.error("Supabase client oluşturulurken hata:", error)
      throw error
    }
  }
  return supabaseClient
}

// Create and export the Supabase client directly
export const supabase = getSupabaseClient()

// Export a function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey
}
