"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/giris-yap?redirect=/hesabim/siparislerim")
        return
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items:order_items(
              *,
              product:products(*)
            )
          `)
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (error) throw error

        setOrder(data)
      } catch (error) {
        console.error("Sipariş yüklenirken hata:", error)
        router.push("/hesabim/siparislerim")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, user, router])

  if (isLoading || authLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Sipariş bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız sipariş bulunamadı veya erişim izniniz yok.</p>
          <Link href="/hesabim/siparislerim">
            <Button>Siparişlerime Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede"
      case "paid":
        return "Ödendi"
      case "shipped":
        return "Kargoya Verildi"
      case "delivered":
        return "Teslim Edildi"
      case "cancelled":
        return "İptal Edildi"
      default:
        return "Bilinmiyor"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/hesabim/siparislerim" className="flex items-center text-primary hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Siparişlerime Dön</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b">
          <div>
            <h1 className="text-xl font-bold mb-1">Sipariş #{order.id}</h1>
            <p className="text-gray-500">Sipariş Tarihi: {new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="font-bold mb-2">Teslimat Adresi</h2>
            <p className="text-gray-600">
              {order.shipping_address}
              <br />
              {order.shipping_city}, {order.shipping_postal_code}
              <br />
              {order.shipping_country}
              <br />
              Tel: {order.contact_phone}
            </p>
          </div>
          <div>
            <h2 className="font-bold mb-2">Ödeme Bilgileri</h2>
            <p className="text-gray-600">
              Ödeme Yöntemi: Banka Havalesi / EFT
              <br />
              Ödeme Durumu: {order.payment_status === "pending" ? "Ödeme Bekleniyor" : "Ödendi"}
            </p>
          </div>
        </div>

        <h2 className="font-bold mb-4">Sipariş Detayları</h2>
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ürün</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Fiyat</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Adet</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.order_items.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 flex-shrink-0 mr-4">
                        <Image
                          src={item.product?.images?.[0] || "/placeholder.svg"}
                          alt={item.product?.name || "Ürün"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product?.name || "Ürün"}</h3>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">{item.price.toLocaleString("tr-TR")} ₺</td>
                  <td className="px-4 py-4 text-right">{item.quantity}</td>
                  <td className="px-4 py-4 text-right font-medium">
                    {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-72">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ara Toplam:</span>
                <span>{(order.total_amount - 150).toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo:</span>
                <span>150,00 ₺</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Toplam:</span>
                <span>{order.total_amount.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
