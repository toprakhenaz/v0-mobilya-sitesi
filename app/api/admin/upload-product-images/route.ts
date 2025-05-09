import { type NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { addProductImage } from "@/lib/admin-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // FormData'dan değerleri al
    const productId = formData.get("productId")
    const productSlug = formData.get("productSlug")
    const isPrimary = formData.get("isPrimary") === "true"

    // Değerleri kontrol et
    if (!productId) {
      console.error("Ürün ID'si eksik")
      return NextResponse.json({ error: "Ürün ID'si eksik" }, { status: 400 })
    }

    if (!productSlug) {
      console.error("Ürün slug'ı eksik")
      return NextResponse.json({ error: "Ürün slug'ı eksik" }, { status: 400 })
    }

    // Resim dosyalarını al
    const files = formData.getAll("images")

    console.log(`Alınan dosya sayısı: ${files.length}`)

    if (!files || files.length === 0) {
      console.error("Hiç resim yüklenmedi")
      return NextResponse.json({ error: "Hiç resim yüklenmedi" }, { status: 400 })
    }

    // Resim dosyalarını kontrol et
    const imageFiles = files.filter((file) => file instanceof File && file.type.startsWith("image/")) as File[]

    console.log(`Geçerli resim sayısı: ${imageFiles.length}`)

    if (imageFiles.length === 0) {
      console.error("Geçerli resim dosyası bulunamadı")
      return NextResponse.json({ error: "Geçerli resim dosyası bulunamadı" }, { status: 400 })
    }

    // Ürün klasörünü oluştur
    const productDir = path.join(process.cwd(), "public", "products", productSlug.toString())

    try {
      await mkdir(productDir, { recursive: true })
      console.log(`Klasör oluşturuldu: ${productDir}`)
    } catch (error) {
      console.error("Klasör oluşturma hatası:", error)
    }

    // Resimleri kaydet ve veritabanına ekle
    const savedImages = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const fileExtension = file.name.split(".").pop() || "jpg"
      const fileName = `${Date.now()}-${i}.${fileExtension}`
      const filePath = path.join(productDir, fileName)
      const fileUrl = `/products/${productSlug}/${fileName}`

      try {
        // Dosyayı kaydet
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)
        console.log(`Dosya kaydedildi: ${filePath}`)

        // Veritabanına ekle
        const isPrimaryImage = isPrimary && i === 0 // İlk resim primary olsun
        const image = await addProductImage(Number(productId), fileUrl, isPrimaryImage)

        if (image) {
          savedImages.push(image)
          console.log(`Resim veritabanına eklendi: ${fileUrl}, Primary: ${isPrimaryImage}`)
        } else {
          console.error(`Resim veritabanına eklenemedi: ${fileUrl}`)
        }
      } catch (error) {
        console.error(`Dosya kaydedilirken hata: ${filePath}`, error)
      }
    }

    return NextResponse.json({
      success: true,
      images: savedImages,
      message: `${savedImages.length} resim başarıyla yüklendi`,
    })
  } catch (error) {
    console.error("Resim yükleme hatası:", error)
    return NextResponse.json({ error: "Resim yüklenirken bir hata oluştu" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
