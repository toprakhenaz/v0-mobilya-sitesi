"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, ChevronRight, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { cartItems } = useCart()
  const [mounted, setMounted] = useState(false)

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Menü</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col h-full">
            <div className="flex-1">
              <Link
                href="/"
                className={`flex justify-between items-center p-4 border-b ${
                  pathname === "/" ? "text-primary" : "text-gray-800"
                }`}
                onClick={onClose}
              >
                <span>Tüm Ürünler</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/kampanyali-urunler"
                className={`flex justify-between items-center p-4 border-b ${
                  pathname === "/kampanyali-urunler" ? "text-primary" : "text-gray-800"
                }`}
                onClick={onClose}
              >
                <span>Kampanyalı Ürünler</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
              {user && (
                <>
                  <Link
                    href="/hesabim"
                    className={`flex justify-between items-center p-4 border-b ${
                      pathname === "/hesabim" ? "text-primary" : "text-gray-800"
                    }`}
                    onClick={onClose}
                  >
                    <span>Hesabım</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/hesabim/siparislerim"
                    className={`flex justify-between items-center p-4 border-b ${
                      pathname === "/hesabim/siparislerim" ? "text-primary" : "text-gray-800"
                    }`}
                    onClick={onClose}
                  >
                    <span>Siparişlerim</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/hesabim/favorilerim"
                    className={`flex justify-between items-center p-4 border-b ${
                      pathname === "/hesabim/favorilerim" ? "text-primary" : "text-gray-800"
                    }`}
                    onClick={onClose}
                  >
                    <span>Favorilerim</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </>
              )}
              <Link
                href="/sepet"
                className={`flex justify-between items-center p-4 border-b ${
                  pathname === "/sepet" ? "text-primary" : "text-gray-800"
                }`}
                onClick={onClose}
              >
                <span>Sepetim</span>
                <div className="flex items-center">
                  {cartItemCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2">
                      {cartItemCount}
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Link>
            </div>

            {/* Login/Logout at the bottom */}
            <div className="mt-auto border-t">
              {user ? (
                <button
                  onClick={() => {
                    signOut()
                    onClose()
                  }}
                  className="flex items-center w-full p-4 text-gray-800 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Çıkış Yap</span>
                </button>
              ) : (
                <Link
                  href="/giris-yap"
                  className="flex items-center w-full p-4 text-gray-800 hover:bg-gray-100"
                  onClick={onClose}
                >
                  <span>Giriş Yap / Üye Ol</span>
                  <ChevronRight className="h-5 w-5 ml-auto" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
