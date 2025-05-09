import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Tablo yapısını kontrol et
    const { data: tableInfo, error: tableError } = await supabase.rpc("get_table_info", {
      table_name: "product_images",
    })

    if (tableError) {
      console.error("Tablo bilgisi alınırken hata:", tableError)

      // Alternatif olarak basit bir sorgu deneyelim
      const { data: testData, error: testError } = await supabase.from("product_images").select("*").limit(1)

      if (testError) {
        return NextResponse.json({
          error: "product_images tablosu bulunamadı veya erişilemedi",
          details: testError.message,
        })
      }

      return NextResponse.json({
        message: "Tablo mevcut ancak yapısı alınamadı",
        sample: testData,
      })
    }

    return NextResponse.json({
      message: "Tablo yapısı başarıyla alındı",
      structure: tableInfo,
    })
  } catch (error) {
    console.error("Tablo kontrolü sırasında hata:", error)
    return NextResponse.json({ error: "Tablo kontrolü sırasında bir hata oluştu" }, { status: 500 })
  }
}
