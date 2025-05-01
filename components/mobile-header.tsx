"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart } from "lucide-react"
import MobileMenu from "./mobile-menu"
import { useCart } from "@/contexts/cart-context"
import SearchBar from "./search-bar"

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cartItems } = useCart()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setIsMenuOpen(true)} aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex-shrink-0">
            <div className="relative h-8 w-32">
              <Image src="/divona-home-logo.png" alt="Divona Home" width={128} height={32} className="object-contain" />
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/sepet" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {isSearchOpen && (
          <div className="px-4 pb-4">
            <SearchBar variant="mobile" placeholder="Hangi ürünü arıyorsunuz?" />
          </div>
        )}
      </header>
    </>
  )
}

export default MobileHeader
