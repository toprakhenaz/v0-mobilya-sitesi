"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, ShoppingBag, User } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function MobileNav() {
  const pathname = usePathname()
  const { cartItems } = useCart()

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            pathname === "/" ? "text-primary" : "text-gray-600"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Ana Sayfa</span>
        </Link>
        <Link
          href="/kategoriler"
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            pathname === "/kategoriler" ? "text-primary" : "text-gray-600"
          }`}
        >
          <Grid className="h-5 w-5" />
          <span className="text-xs mt-1">Kategoriler</span>
        </Link>
        <Link
          href="/sepet"
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            pathname === "/sepet" ? "text-primary" : "text-gray-600"
          }`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Sepetim</span>
        </Link>
        <Link
          href="/hesabim"
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            pathname.startsWith("/hesabim") ? "text-primary" : "text-gray-600"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Hesabım</span>
        </Link>
      </div>
    </div>
  )
}
