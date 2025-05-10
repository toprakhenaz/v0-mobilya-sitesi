import { NextResponse } from "next/server"
import { deleteOrderImage } from "@/lib/order-image-service"

export async function DELETE(request: Request, { params }: { params: { id: string; imageId: string } }) {
  try {
    const { imageId } = params

    if (!imageId) {
      return NextResponse.json({ error: "Geçersiz resim ID" }, { status: 400 })
    }

    const success = await deleteOrderImage(imageId)

    if (!success) {
      return NextResponse.json({ error: "Resim silinirken bir hata oluştu" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order image:", error)
    return NextResponse.json({ error: "Resim silinirken bir hata oluştu" }, { status: 500 })
  }
}
