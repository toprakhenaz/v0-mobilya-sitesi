import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { addProductImage } from "@/lib/admin-service"

export async function POST(request: NextRequest) {
  try {
    console.log("Çoklu resim yükleme API'si çağrıldı")

    const formData = await request.formData()

    const productId = formData.get("productId") as string
    const productSlug = (formData.get("productSlug") as string) || "urun"

    if (!productId) {
      console.error("Ürün ID'si bulunamadı")
      return NextResponse.json({ error: "Ürün ID'si bulunamadı" }, { status: 400 })
    }

    console.log("Ürün bilgileri:", { productId, productSlug })

    // Klasörün var olduğundan emin ol
    const uploadDir = path.join(process.cwd(), "public", "products")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error("Klasör oluşturulurken hata:", error)
    }

    const uploadedImages = []
    let isFirstImage = true

    // formData'dan tüm dosyaları al
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && key.startsWith("images")) {
        const file = value
        console.log(`İşleniyor: ${key}, dosya adı: ${file.name}`)

        // Dosya adını oluştur: slug-timestamp.uzantı
        const fileExtension = path.extname(file.name)
        const timestamp = Date.now() + Math.floor(Math.random() * 1000)
        const fileName = `${productSlug}-${timestamp}${fileExtension}`

        // Dosya yolunu oluştur
        const filePath = path.join(uploadDir, fileName)

        // Dosyayı kaydet
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        await writeFile(filePath, buffer)
        console.log("Dosya başarıyla kaydedildi:", filePath)

        // Veritabanına kaydet
        const imageUrl = `/products/${fileName}`
        const savedImage = await addProductImage(Number.parseInt(productId), imageUrl, isFirstImage)

        if (savedImage) {
          uploadedImages.push(savedImage)
          console.log("Resim başarıyla yüklendi:", savedImage)
        } else {
          console.error(`${key} için resim veritabanına kaydedilemedi`)
        }

        // İlk resim işlendikten sonra diğerleri ana resim olmasın
        isFirstImage = false
      }
    }

    if (uploadedImages.length === 0) {
      console.error("Hiç resim yüklenemedi")
      return NextResponse.json({ error: "Hiç resim yüklenemedi" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} resim başarıyla yüklendi`,
      images: uploadedImages,
    })
  } catch (error) {
    console.error("Resimler yüklenirken hata:", error)
    return NextResponse.json({ error: "Resimler yüklenirken hata oluştu" }, { status: 500 })
  }
}
