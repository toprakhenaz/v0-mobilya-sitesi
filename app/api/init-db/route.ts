import { NextResponse } from "next/server"
import { initDb, seedDb } from "@/lib/db"

export async function GET() {
  try {
    await initDb()
    await seedDb()

    return NextResponse.json({ success: true, message: "Database initialized and seeded successfully" })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
