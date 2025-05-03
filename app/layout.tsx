import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { SiteSettingsProvider } from "@/contexts/site-settings-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Divona Home - Bahçe Mobilyaları",
  description: "Bahçe mobilyaları ve dış mekan dekorasyonu için Divona Home",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <SiteSettingsProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              {children}
            </CartProvider>
          </AuthProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
