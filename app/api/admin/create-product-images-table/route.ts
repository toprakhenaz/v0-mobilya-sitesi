import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import fs from "fs"
import path from "path"

export async function POST() {
  try {
    // SQL dosyasını oku
    const sqlFilePath = path.join(process.cwd(), "lib", "sql", "create_product_images_table.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // SQL'i çalıştır
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("SQL çalıştırılırken hata:", error)
      return NextResponse.json({ error: "SQL çalıştırılırken bir hata oluştu" }, { status: 500 })
    }

    return NextResponse.json({
      message: "product_images tablosu başarıyla oluşturuldu",
    })
  } catch (error) {
    console.error("Tablo oluşturulurken hata:", error)
    return NextResponse.json({ error: "Tablo oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}
