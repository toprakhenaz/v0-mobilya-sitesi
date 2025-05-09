import { type NextRequest, NextResponse } from "next/server"
import { setPrimaryImage } from "@/lib/admin-service"

export async function POST(request: NextRequest) {
  try {
    const { imageId, productId } = await request.json()

    if (!imageId || !productId) {
      return NextResponse.json({ error: "Geçersiz resim veya ürün ID" }, { status: 400 })
    }

    const success = await setPrimaryImage(imageId, productId)

    if (!success) {
      return NextResponse.json({ error: "Ana resim ayarlanamadı" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Ana resim başarıyla ayarlandı",
    })
  } catch (error) {
    console.error("Ana resim ayarlama hatası:", error)
    return NextResponse.json({ error: "Ana resim ayarlanırken bir hata oluştu" }, { status: 500 })
  }
}
