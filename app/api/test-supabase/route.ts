import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Check if Supabase is configured
    const isConfigured = isSupabaseConfigured()

    if (!isConfigured) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase is not properly configured. Check your environment variables.",
          env: {
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL || !!process.env.SUPABASE_URL,
            hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !!process.env.SUPABASE_ANON_KEY,
          },
        },
        { status: 500 },
      )
    }

    // Try to fetch some data from Supabase
    const { data, error } = await supabase.from("site_settings").select("*").limit(1)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error connecting to Supabase",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
      data: data,
    })
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error testing Supabase connection",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
