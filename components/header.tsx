"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, LogOut, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useSiteSettings } from "@/components/admin/site-settings-provider"
import SearchBar from "./search-bar"
import Logo from "./logo"
import MobileMenu from "./mobile-menu"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { cartItems } = useCart()
  const { getSetting } = useSiteSettings()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const freeShippingThreshold = Number.parseFloat(
    getSetting("free_shipping_threshold") || getSetting("ucretsiz_kargo_esigi") || "5000",
  )

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar - Only on Desktop */}
      <div className="hidden md:block bg-gray-50 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center py-2">
          <div className="text-sm">
            <span className="font-medium text-primary">Ücretsiz Kargo</span> -{" "}
            {freeShippingThreshold.toLocaleString("tr-TR")} TL ve üzeri siparişlerde
          </div>
          <div className="flex space-x-4 text-sm">
            <Link href="/hakkimizda" className="hover:text-primary">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="hover:text-primary">
              İletişim
            </Link>
            <Link href="/siparis-takibi" className="hover:text-primary">
              Sipariş Takibi
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menü</span>
          </Button>
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="medium" />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Mobile Search Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Ara</span>
            </Button>

            {/* User Actions */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="group relative">
                  <Link href="/hesabim" className="flex items-center hover:text-primary">
                    <User className="h-5 w-5 mr-2" />
                    <span>Hesabım</span>
                  </Link>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 hidden group-hover:block">
                    <Link href="/hesabim" className="block px-4 py-2 hover:bg-gray-100">
                      Hesap Bilgilerim
                    </Link>
                    <Link href="/hesabim/siparislerim" className="block px-4 py-2 hover:bg-gray-100">
                      Siparişlerim
                    </Link>
                    <Link href="/hesabim/favorilerim" className="block px-4 py-2 hover:bg-gray-100">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        <span>Favorilerim</span>
                      </div>
                    </Link>
                    <Link href="/hesabim/adreslerim" className="block px-4 py-2 hover:bg-gray-100">
                      Adreslerim
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/giris-yap" className="hidden md:flex items-center hover:text-primary">
                <User className="h-5 w-5 mr-2" />
                <span>Giriş Yap</span>
              </Link>
            )}
            <Link href="/sepet" className="flex items-center hover:text-primary">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline ml-2">Sepetim</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search - Conditional */}
        {isSearchOpen && (
          <div className="mt-3 md:hidden">
            <SearchBar variant="mobile" />
          </div>
        )}
      </div>

      {/* Navigation - Desktop Only */}
      <nav className="hidden md:block border-t">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-8">
            <li>
              <Link href="/urunler" className="block py-3 font-medium hover:text-primary">
                Tüm Ürünler
              </Link>
            </li>
            <li>
              <Link href="/kategoriler" className="block py-3 font-medium hover:text-primary">
                Kategoriler
              </Link>
            </li>
            <li>
              <Link href="/kampanyali-urunler" className="block py-3 font-medium hover:text-primary">
                Kampanyalı Ürünler
              </Link>
            </li>
            <li>
              <Link href="/yeni-urunler" className="block py-3 font-medium hover:text-primary text-red-500">
                Yeni Ürünler
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
