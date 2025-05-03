"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/contexts/admin-context"
import { Loader2 } from "lucide-react"

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdmin()
  const pathname = usePathname()

  // Login sayfasında sidebar ve header gösterme
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  // Yükleme durumunda loading göster
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    window.location.href = "/admin/login"
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
