import { createClient } from "@supabase/supabase-js"

// Supabase URL ve Anon Key'i doğrudan process.env'den al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Çevre değişkenlerini kontrol et ve konsola bilgi yazdır
console.log("Supabase URL:", supabaseUrl ? "Mevcut" : "Eksik")
console.log("Supabase Anon Key:", supabaseAnonKey ? "Mevcut" : "Eksik")
console.log(
  "Supabase Anon Key (ilk 10 karakter):",
  supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + "..." : "Eksik",
)

// Eğer çevre değişkenleri eksikse, hata mesajı yazdır
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("HATA: Supabase URL veya Anon Key bulunamadı!")
  console.error("Lütfen .env dosyasını kontrol edin ve aşağıdaki değişkenlerin olduğundan emin olun:")
  console.error("NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY")
  console.error(
    "Mevcut değişkenler:",
    Object.keys(process.env).filter((key) => key.includes("SUPABASE") || key.includes("POSTGRES")),
  )
}

// Supabase istemcisini oluştur
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL ve Anon Key sağlanmalıdır. Lütfen .env dosyasını kontrol edin.")
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

// Supabase istemcisini oluştur ve dışa aktar
let supabase: ReturnType<typeof createClient>

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL ve Anon Key sağlanmalıdır. Lütfen .env dosyasını kontrol edin.")
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
    },
  })

  console.log("Supabase client başarıyla oluşturuldu ve dışa aktarıldı")
} catch (error) {
  console.error("Supabase client başlatılamadı:", error)

  // Hata durumunda yedek bir istemci oluştur
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({
            range: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" }, count: 0 }),
            then: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" }, count: 0 }),
          }),
          range: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" }, count: 0 }),
          then: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" }, count: 0 }),
        }),
        limit: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" } }),
        single: () => Promise.resolve({ data: null, error: { message: "Supabase bağlantısı kurulamadı" } }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "Supabase bağlantısı kurulamadı" } }),
          limit: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" } }),
          then: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" } }),
        }),
        neq: () => ({
          limit: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" } }),
        }),
        gt: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" } }),
          }),
        }),
        not: () => ({
          gt: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" } }),
            }),
          }),
        }),
        or: () => ({
          range: () => Promise.resolve({ data: [], error: { message: "Supabase bağlantısı kurulamadı" }, count: 0 }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: "Supabase bağlantısı kurulamadı" } }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "Supabase bağlantısı kurulamadı" } }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: "Supabase bağlantısı kurulamadı" } }),
      }),
      upsert: () => Promise.resolve({ error: { message: "Supabase bağlantısı kurulamadı" } }),
    }),
    auth: {
      signUp: () => Promise.resolve({ data: null, error: { message: "Supabase bağlantısı kurulamadı" } }),
      signIn: () => Promise.resolve({ data: null, error: { message: "Supabase bağlantısı kurulamadı" } }),
      signOut: () => Promise.resolve({ error: { message: "Supabase bağlantısı kurulamadı" } }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: { message: "Supabase bağlantısı kurulamadı" } }),
    },
  } as any
}

// Supabase istemcisini dışa aktar
export { supabase }

// Supabase'in doğru yapılandırıldığını kontrol eden fonksiyon
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey
}

// Çevre değişkenlerini kontrol eden fonksiyon
export function checkEnvironmentVariables(): {
  isConfigured: boolean
  missingVariables: string[]
  availableVariables: string[]
} {
  const requiredVariables = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "POSTGRES_URL",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_HOST",
    "POSTGRES_DATABASE",
  ]

  const missingVariables = requiredVariables.filter((variable) => !process.env[variable])
  const availableVariables = requiredVariables.filter((variable) => !!process.env[variable])

  return {
    isConfigured: missingVariables.length === 0,
    missingVariables,
    availableVariables,
  }
}
