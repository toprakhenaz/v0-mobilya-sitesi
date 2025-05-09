import { type NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { writeFile, mkdir } from "fs/promises"
import { addProductImage } from "@/lib/admin-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = Number(formData.get("productId"))
    const isPrimary = formData.get("isPrimary") === "true"

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 })
    }

    // Dosya içeriğini al
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Dosya adını oluştur (benzersiz olması için timestamp ekle)
    const originalFilename = file.name
    const fileExtension = originalFilename.split(".").pop()
    const timestamp = Date.now()
    const filename = `product_${productId}_${timestamp}.${fileExtension}`

    // Dosya yolunu oluştur
    const uploadDir = join(process.cwd(), "public", "uploads", "products")
    const filePath = join(uploadDir, filename)
    const publicPath = `/uploads/products/${filename}`

    // Klasörü oluştur (yoksa)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error("Klasör oluşturma hatası:", error)
    }

    // Dosyayı kaydet
    await writeFile(filePath, buffer)

    // Veritabanına kaydet
    const image = await addProductImage(productId, publicPath, isPrimary)

    if (!image) {
      return NextResponse.json({ error: "Resim veritabanına kaydedilemedi" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Resim başarıyla yüklendi",
      image,
      url: publicPath,
    })
  } catch (error) {
    console.error("Resim yükleme hatası:", error)
    return NextResponse.json({ error: "Resim yüklenirken bir hata oluştu" }, { status: 500 })
  }
}
