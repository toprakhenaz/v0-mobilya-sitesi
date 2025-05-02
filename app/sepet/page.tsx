"use client"

import Link from "next/link"
import { Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import CartItem from "@/components/cart/cart-item"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Cart() {
  const { cartItems, isLoading, subtotal, shipping, total, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    router.push("/siparis")
  }

  if (isLoading || authLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b">
                  <div className="col-span-6">
                    <span className="font-medium">Ürün</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium">Fiyat</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-medium">Adet</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-medium">Toplam</span>
                  </div>
                </div>

                {/* Cart Item List */}
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}

                {/* Continue Shopping and Clear Cart */}
                <div className="flex justify-between p-4">
                  <Link href="/" className="text-primary hover:underline">
                    Alışverişe Devam Et
                  </Link>
                  <button className="text-gray-500 hover:text-red-500" onClick={() => clearCart()}>
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span>{subtotal.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kargo</span>
                    <span>{shipping === 0 ? "Ücretsiz" : `${shipping.toLocaleString("tr-TR")} ₺`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Toplam</span>
                      <span className="text-xl">{total.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="w-full" onClick={handleCheckout}>
                  Siparişi Tamamla
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-6">Sepetinizde henüz ürün bulunmamaktadır.</p>
            <Link href="/">
              <Button>Alışverişe Başla</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
