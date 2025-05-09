import { NextResponse } from "next/server"
import { supabase, checkEnvironmentVariables } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Çevre değişkenlerini kontrol et
    const envCheck = checkEnvironmentVariables()

    // Supabase bağlantısını test et
    const { data, error } = await supabase.from("site_settings").select("*").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase bağlantı hatası",
          error: error.message,
          envCheck,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKeyFirstChars: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "..."
            : "Eksik",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabase bağlantısı başarılı",
      data: data ? "Veri alındı" : "Veri yok",
      envCheck,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKeyFirstChars: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "..."
        : "Eksik",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Beklenmeyen hata",
        error: error.message,
        envCheck: checkEnvironmentVariables(),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKeyFirstChars: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "..."
          : "Eksik",
      },
      { status: 500 },
    )
  }
}
