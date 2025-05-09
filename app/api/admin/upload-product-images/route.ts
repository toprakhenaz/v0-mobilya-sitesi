import { type NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { addProductImage, updateProductImageUrls } from "@/lib/admin-service"

export async function POST(request: NextRequest) {
  try {
    console.log("Çoklu resim yükleme API'si çağrıldı")

    const formData = await request.formData()

    // FormData'dan değerleri al
    const productId = formData.get("productId") as string
    const productSlug = (formData.get("productSlug") as string) || "urun"
    const isPrimary = formData.get("isPrimary") === "true"

    console.log("Ürün bilgileri:", { productId, productSlug, isPrimary })

    if (!productId) {
      console.error("Ürün ID'si eksik")
      return NextResponse.json({ error: "Ürün ID'si eksik" }, { status: 400 })
    }

    // Resim dosyalarını al
    const files = formData.getAll("images").filter((file) => file instanceof File) as File[]

    console.log(`Alınan dosya sayısı: ${files.length}`)

    if (files.length === 0) {
      console.error("Hiç resim yüklenmedi")
      return NextResponse.json({ error: "Hiç resim yüklenmedi" }, { status: 400 })
    }

    // Klasörü oluştur
    const uploadDir = path.join(process.cwd(), "public", "products")
    try {
      await mkdir(uploadDir, { recursive: true })
      console.log("Klasör oluşturuldu veya zaten var:", uploadDir)
    } catch (error) {
      console.error("Klasör oluşturma hatası:", error)
    }

    const uploadedImages = []
    let isFirst = true

    // Her dosyayı işle
    for (const file of files) {
      try {
        console.log(`İşleniyor: ${file.name}, boyut: ${file.size} bayt`)

        // Dosya adını oluştur: slug-timestamp.uzantı
        const fileExtension = path.extname(file.name)
        const timestamp = Date.now() + Math.floor(Math.random() * 1000)
        const fileName = `${productSlug}-${timestamp}${fileExtension}`

        // Dosya yolunu oluştur
        const filePath = path.join(uploadDir, fileName)
        const publicPath = `/products/${fileName}`

        // Dosyayı kaydet
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        await writeFile(filePath, buffer)
        console.log("Dosya başarıyla kaydedildi:", filePath)
        console.log("Public path:", publicPath)

        // Veritabanına kaydet
        const currentIsPrimary = isFirst && isPrimary
        console.log("Veritabanına ekleniyor:", {
          productId: Number(productId),
          publicPath,
          isPrimary: currentIsPrimary,
        })

        const savedImage = await addProductImage(Number(productId), publicPath, currentIsPrimary)

        if (savedImage) {
          uploadedImages.push(savedImage)
          console.log("Resim başarıyla veritabanına kaydedildi:", savedImage)
        } else {
          console.error("Resim veritabanına kaydedilemedi:", publicPath)
        }

        // İlk resim işlendikten sonra diğerleri ana resim olmasın
        isFirst = false
      } catch (error) {
        console.error(`Dosya işlenirken hata:`, error)
      }
    }

    if (uploadedImages.length === 0) {
      console.error("Hiç resim veritabanına kaydedilemedi")
      return NextResponse.json({ error: "Hiç resim veritabanına kaydedilemedi" }, { status: 500 })
    }

    // Ürünün image_urls alanını güncelle
    try {
      await updateProductImageUrls(Number(productId))
      console.log(`Ürün (ID: ${productId}) image_urls alanı güncellendi`)
    } catch (error) {
      console.error(`Ürün image_urls güncellenirken hata:`, error)
    }

    console.log(`${uploadedImages.length} resim başarıyla yüklendi`)
    return NextResponse.json({
      success: true,
      message: `${uploadedImages.length} resim başarıyla yüklendi`,
      images: uploadedImages,
    })
  } catch (error) {
    console.error("Resimler yüklenirken hata:", error)
    return NextResponse.json({ error: "Resimler yüklenirken bir hata oluştu" }, { status: 500 })
  }
}
