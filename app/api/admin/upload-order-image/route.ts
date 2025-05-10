import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { writeFile } from "fs/promises"
import { join } from "path"
import { ensureUploadDir } from "@/lib/utils/ensure-upload-dir"

// Resim yükleme için hedef dizin
const UPLOAD_PATH = "uploads/orders"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Dizinin var olduğundan emin ol
    await ensureUploadDir(UPLOAD_PATH)

    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 })
    }

    // Benzersiz dosya adı oluştur
    const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = join(process.cwd(), "public", UPLOAD_PATH, fileName)

    // Dosyayı diske kaydet
    const buffer = Buffer.from(await image.arrayBuffer())
    await writeFile(filePath, buffer)

    // Web'den erişilebilir path
    const imageUrl = `/${UPLOAD_PATH}/${fileName}`

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    })
  } catch (error) {
    console.error("Sipariş resmi yükleme hatası:", error)
    return NextResponse.json(
      {
        error: "Resim yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
