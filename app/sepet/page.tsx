"use client"

import Link from "next/link"
import Image from "next/image"
import { Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import CartItem from "@/components/cart/cart-item"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useSiteSettings } from "@/components/admin/site-settings-provider"
import { useEffect } from "react"

export default function Cart() {
  const { cartItems, isLoading, subtotal, shipping, total, clearCart } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { getSetting } = useSiteSettings()

  // Kargo ayarları
  const shippingFee = Number.parseFloat(getSetting("shipping_fee") || getSetting("kargo_ucreti") || "0")
  const freeShippingThreshold = Number.parseFloat(
    getSetting("free_shipping_threshold") || getSetting("ucretsiz_kargo_esigi") || "1000",
  )

  // Banka bilgileri
  const bankName = getSetting("bank_name") || getSetting("banka_adi") || ""
  const accountHolder = getSetting("account_holder") || getSetting("hesap_sahibi") || ""
  const iban = getSetting("iban") || ""

  // WhatsApp bilgileri
  const whatsappNumber = getSetting("whatsapp_number") || getSetting("whatsapp_numarasi") || ""
  const defaultMessage =
    getSetting("whatsapp_message") || getSetting("varsayilan_mesaj") || "Merhaba, sipariş vermek istiyorum."

  // Log cart items for debugging
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("Cart items:", cartItems)
      cartItems.forEach((item) => {
        console.log(
          `Product: ${item.product.name}, Image:`,
          item.product.images || item.product.image_urls || "No image",
        )
      })
    }
  }, [cartItems])

  const handleCheckout = () => {
    router.push("/siparis")
  }

  // WhatsApp ile ödeme linki oluştur
  const getWhatsAppLink = () => {
    if (!whatsappNumber) return "#"

    // Telefon numarasını formatlama (başında + işareti olmalı)
    let formattedNumber = whatsappNumber.startsWith("+")
      ? whatsappNumber
      : whatsappNumber.startsWith("0")
        ? "+9" + whatsappNumber
        : "+90" + whatsappNumber

    // Boşluk, parantez gibi karakterleri temizle
    formattedNumber = formattedNumber.replace(/[\s()-]/g, "")

    // Mesaj oluştur
    const message = encodeURIComponent(
      `${defaultMessage} PTT ile güvenli ödeme yapmak istiyorum. Sepet tutarı: ${total.toLocaleString("tr-TR")} ₺`,
    )

    return `https://wa.me/${formattedNumber}?text=${message}`
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
                    <span>
                      {subtotal >= freeShippingThreshold || shipping === 0
                        ? "Ücretsiz"
                        : `${shipping.toLocaleString("tr-TR")} ₺`}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Toplam</span>
                      <span className="text-xl">{total.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  {/* Normal Checkout Button */}
                  <Button className="w-full" onClick={handleCheckout}>
                    Siparişi Tamamla
                  </Button>

                  {/* PTT ile Güvenli Ödeme Butonu */}
                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <span className="relative px-2 bg-white text-sm text-gray-500">veya</span>
                  </div>

                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="block">
                    <Button
                      className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black flex items-center justify-center gap-2"
                      variant="outline"
                    >
                      <Image src="/ptt-logo.png" alt="PTT Logo" width={24} height={24} className="rounded-sm" />
                      PTT ile Güvenli Ödeme Yap
                    </Button>
                  </a>
                </div>

                {/* Banka Bilgileri */}
                {bankName && accountHolder && iban && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-2">Havale/EFT Bilgileri</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Banka:</span> {bankName}
                      </p>
                      <p>
                        <span className="font-medium">Hesap Sahibi:</span> {accountHolder}
                      </p>
                      <p>
                        <span className="font-medium">IBAN:</span> {iban}
                      </p>
                    </div>
                  </div>
                )}
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
