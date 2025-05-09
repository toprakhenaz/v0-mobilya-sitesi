"use client"

import Link from "next/link"
import { Home, LayoutGrid, ShoppingBag, User, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export default function MobileBottomNav() {
  const { user } = useAuth()
  const { cartItems } = useCart()

  // Calculate total items in cart
  const cartItemCount =
    cartItems && cartItems.length > 0 ? cartItems.reduce((total, item) => total + (item.quantity || 0), 0) : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="flex flex-col items-center justify-center p-3 hover:text-primary transition-colors">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Ana Sayfa</span>
        </Link>

        <Link
          href="/kategoriler"
          className="flex flex-col items-center justify-center p-3 hover:text-primary transition-colors"
        >
          <LayoutGrid className="h-5 w-5 mb-1" />
          <span className="text-xs">Kategoriler</span>
        </Link>

        <Link
          href="/sepet"
          className="flex flex-col items-center justify-center p-3 hover:text-primary transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 mb-1" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-xs">Sepet</span>
        </Link>

        {user ? (
          <Link
            href="/hesabim"
            className="flex flex-col items-center justify-center p-3 hover:text-primary transition-colors"
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Hesap</span>
          </Link>
        ) : (
          <Link
            href="/giris-yap"
            className="flex flex-col items-center justify-center p-3 hover:text-primary transition-colors"
          >
            <LogIn className="h-5 w-5 mb-1" />
            <span className="text-xs">Giriş</span>
          </Link>
        )}
      </div>
    </div>
  )
}
