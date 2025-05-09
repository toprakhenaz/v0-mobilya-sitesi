import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    let products

    if (categorySlug) {
      products = await prisma.product.findMany({
        where: {
          category: {
            slug: categorySlug,
          },
        },
        include: {
          category: true,
          product_images: true,
        },
        take: limit,
      })
    } else {
      products = await prisma.product.findMany({
        include: {
          category: true,
          product_images: true,
        },
        take: limit,
      })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
