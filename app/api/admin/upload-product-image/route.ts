import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { writeFile } from "fs/promises"
import { join } from "path"
import { ensureUploadDir } from "@/lib/utils/ensure-upload-dir"

// Resim yükleme için hedef dizin
const UPLOAD_PATH = "uploads/products"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Dizinin var olduğundan emin ol
    await ensureUploadDir(UPLOAD_PATH)

    // Tek bir resim veya çoklu resim olabilir
    const images = formData.getAll("image") as File[]

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 })
    }

    // Birden fazla resim için URL'leri sakla
    const imageUrls: string[] = []

    // Her resmi işle
    for (const image of images) {
      // Benzersiz dosya adı oluştur
      const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg"
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = join(process.cwd(), "public", UPLOAD_PATH, fileName)

      // Dosyayı diske kaydet
      const buffer = Buffer.from(await image.arrayBuffer())
      await writeFile(filePath, buffer)

      // URL'yi listeye ekle (web'den erişilebilir path)
      const imageUrl = `/${UPLOAD_PATH}/${fileName}`
      imageUrls.push(imageUrl)
    }

    // Tek resim yüklendiyse eski API yanıtı formatını koru
    if (imageUrls.length === 1) {
      return NextResponse.json({
        success: true,
        imageUrl: imageUrls[0],
      })
    }

    // Çoklu resim için yeni format
    return NextResponse.json({
      success: true,
      imageUrls: imageUrls,
    })
  } catch (error) {
    console.error("Resim yükleme hatası:", error)
    return NextResponse.json(
      {
        error: "Resim yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
