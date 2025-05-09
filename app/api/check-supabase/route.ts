import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          status: "error",
          message: "Supabase is not properly configured. Check your environment variables.",
          configured: false,
          env: {
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
            hasNextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasNextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        },
        { status: 500 },
      )
    }

    // Test the connection
    const { data, error } = await supabase.from("site_settings").select("count(*)", { count: "exact" })

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to Supabase",
          error: error.message,
          configured: true,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Successfully connected to Supabase",
      configured: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
