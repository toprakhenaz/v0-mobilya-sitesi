import { NextResponse } from "next/server"
import { openDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await openDb()
    const categories = await db.all("SELECT * FROM categories ORDER BY name ASC")

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
