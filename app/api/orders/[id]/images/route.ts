import { NextResponse } from "next/server"
import { getOrderImages, saveOrderImage } from "@/lib/order-image-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id, 10)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Geçersiz sipariş ID" }, { status: 400 })
    }

    const images = await getOrderImages(orderId)

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching order images:", error)
    return NextResponse.json({ error: "Sipariş resimleri alınırken bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id, 10)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Geçersiz sipariş ID" }, { status: 400 })
    }

    const body = await request.json()
    const { url, description } = body

    if (!url) {
      return NextResponse.json({ error: "Resim URL'si gerekli" }, { status: 400 })
    }

    const image = await saveOrderImage(orderId, url, description)

    if (!image) {
      return NextResponse.json({ error: "Resim kaydedilirken bir hata oluştu" }, { status: 500 })
    }

    return NextResponse.json({ success: true, image })
  } catch (error) {
    console.error("Error saving order image:", error)
    return NextResponse.json({ error: "Resim kaydedilirken bir hata oluştu" }, { status: 500 })
  }
}
