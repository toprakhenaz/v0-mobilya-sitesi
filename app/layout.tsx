import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SiteSettingsProvider } from "@/components/admin/site-settings-provider"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import WhatsAppButton from "@/components/whatsapp-button"

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
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <WhatsAppButton />
                <Toaster />
              </div>
            </SiteSettingsProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
