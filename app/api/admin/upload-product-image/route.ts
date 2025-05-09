import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { addProductImage } from "@/lib/admin-service"

export async function POST(request: NextRequest) {
  try {
    console.log("Resim yükleme API'si çağrıldı")

    const formData = await request.formData()

    // Hem "file" hem de "image" olarak kontrol et
    const file = (formData.get("file") as File) || (formData.get("image") as File)
    const productId = formData.get("productId") as string
    const isPrimary = formData.get("isPrimary") === "true"

    console.log("Alınan form verileri:", {
      fileExists: !!file,
      productId,
      isPrimary,
      fileName: file?.name,
      fileSize: file?.size,
    })

    if (!file) {
      console.error("Dosya bulunamadı")
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (!productId) {
      console.error("Ürün ID'si bulunamadı")
      return NextResponse.json({ error: "Ürün ID'si bulunamadı" }, { status: 400 })
    }

    // Ürün slug'ını al
    const productSlug = (formData.get("productSlug") as string) || "urun"

    // Dosya adını oluştur: slug-timestamp.uzantı
    const fileExtension = path.extname(file.name)
    const timestamp = Date.now()
    const fileName = `${productSlug}-${timestamp}${fileExtension}`

    // Dosya yolunu oluştur
    const uploadDir = path.join(process.cwd(), "public", "products")
    const filePath = path.join(uploadDir, fileName)

    console.log("Oluşturulan dosya yolu:", filePath)

    // Klasörün var olduğundan emin ol
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error("Klasör oluşturulurken hata:", error)
    }

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)
    console.log("Dosya başarıyla kaydedildi:", filePath)

    // Veritabanına kaydet
    const imageUrl = `/products/${fileName}`
    console.log("Veritabanına kaydedilecek URL:", imageUrl)

    const savedImage = await addProductImage(Number.parseInt(productId), imageUrl, isPrimary)

    if (!savedImage) {
      console.error("Resim veritabanına kaydedilemedi")
      return NextResponse.json({ error: "Resim veritabanına kaydedilemedi" }, { status: 500 })
    }

    console.log("Resim başarıyla yüklendi:", savedImage)

    return NextResponse.json({
      success: true,
      message: "Resim başarıyla yüklendi",
      image: savedImage,
      url: imageUrl,
    })
  } catch (error) {
    console.error("Resim yüklenirken hata:", error)
    return NextResponse.json({ error: "Resim yüklenirken hata oluştu" }, { status: 500 })
  }
}
