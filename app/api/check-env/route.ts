import { NextResponse } from "next/server"
import { checkEnvironmentVariables } from "@/lib/supabase-client"

export async function GET() {
  try {
    const envCheck = checkEnvironmentVariables()

    return NextResponse.json({
      success: true,
      isConfigured: envCheck.isConfigured,
      missingVariables: envCheck.missingVariables,
      availableVariables: envCheck.availableVariables,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Mevcut" : "Eksik",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Mevcut" : "Eksik",
        SUPABASE_URL: process.env.SUPABASE_URL ? "Mevcut" : "Eksik",
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Mevcut" : "Eksik",
        POSTGRES_URL: process.env.POSTGRES_URL ? "Mevcut" : "Eksik",
        POSTGRES_USER: process.env.POSTGRES_USER ? "Mevcut" : "Eksik",
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? "Mevcut" : "Eksik",
        POSTGRES_HOST: process.env.POSTGRES_HOST ? "Mevcut" : "Eksik",
        POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? "Mevcut" : "Eksik",
      },
    })
  } catch (error) {
    console.error("Çevre değişkenleri kontrol edilirken hata:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Çevre değişkenleri kontrol edilirken hata oluştu",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
