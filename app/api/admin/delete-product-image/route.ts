import { type NextRequest, NextResponse } from "next/server"
import { deleteProductImage, updateProductImageUrls } from "@/lib/admin-service"
import { unlink } from "fs/promises"
import { join } from "path"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = Number(searchParams.get("imageId"))
    const productId = Number(searchParams.get("productId"))
    const imageUrl = searchParams.get("imageUrl")

    if (!imageId || !productId || !imageUrl) {
      return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 })
    }

    // Veritabanından resmi sil
    await deleteProductImage(imageId)

    // Dosya sisteminden resmi sil
    try {
      // URL'den dosya yolunu al (/uploads/products/filename.jpg -> public/uploads/products/filename.jpg)
      const filePath = join(process.cwd(), "public", imageUrl)
      await unlink(filePath)
    } catch (fileError) {
      console.error("Dosya silme hatası:", fileError)
      // Dosya silinmese bile devam et, veritabanından silindi
    }

    // Ürünün image_urls alanını güncelle
    await updateProductImageUrls(productId)

    return NextResponse.json({
      message: "Resim başarıyla silindi",
    })
  } catch (error) {
    console.error("Resim silme hatası:", error)
    return NextResponse.json({ error: "Resim silinirken bir hata oluştu" }, { status: 500 })
  }
}
