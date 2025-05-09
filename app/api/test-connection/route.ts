import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Basit bir sorgu yaparak bağlantıyı test edelim
    const { data, error } = await supabase.from("categories").select("id, name").limit(1)

    if (error) {
      console.error("Supabase bağlantı hatası:", error)
      return NextResponse.json({ success: false, error: error.message, details: error }, { status: 500 })
    }

    // Çevre değişkenlerinin ilk birkaç karakterini gösterelim (güvenlik için)
    const envInfo = {
      SUPABASE_URL: process.env.SUPABASE_URL?.substring(0, 10) + "...",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 10) + "...",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) + "...",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + "...",
    }

    return NextResponse.json({
      success: true,
      message: "Supabase bağlantısı başarılı",
      data,
      envInfo,
    })
  } catch (error: any) {
    console.error("Test sırasında hata:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
