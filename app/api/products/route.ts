import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get("category")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    const db = await openDb()
    let products = []

    if (categorySlug) {
      // Belirli bir kategorideki ürünleri getir
      products = await db.all(
        `
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE c.slug = ?
        LIMIT ?
      `,
        [categorySlug, limit || 100],
      )
    } else {
      // Tüm ürünleri getir
      products = await db.all(
        `
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LIMIT ?
      `,
        [limit || 100],
      )
    }

    // Her ürün için görselleri getir
    for (const product of products) {
      const images = await db.all(
        `
        SELECT * FROM product_images
        WHERE product_id = ?
      `,
        [product.id],
      )

      product.product_images = images
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
