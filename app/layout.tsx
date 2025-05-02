import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SiteSettingsProvider } from "@/components/admin/site-settings-provider"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Divona Home - Bahçe Mobilyaları",
  description: "Divona Home, bahçe mobilyaları ve dış mekan dekorasyonu konusunda Türkiye'nin önde gelen markasıdır.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <SiteSettingsProvider>
              {children}
              <Toaster />
            </SiteSettingsProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
