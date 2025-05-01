"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrderById } from "@/lib/order-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const orderId = searchParams.get("order_id")

  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        router.push("/")
        return
      }

      try {
        const orderData = await getOrderById(Number(orderId), user?.id)
        if (!orderData) {
          router.push("/")
          return
        }
        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router, user])

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderId || "")
    toast({
      title: "Kopyalandı",
      description: "Sipariş numarası panoya kopyalandı.",
    })
  }

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Sipariş bulunamadı</h1>
        <p className="mb-6">İstediğiniz sipariş bulunamadı veya bu siparişi görüntüleme yetkiniz yok.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Siparişiniz Alındı</h1>
              <p className="text-gray-600">
                Siparişiniz başarıyla oluşturuldu. Sipariş detayları aşağıda yer almaktadır.
              </p>
            </div>

            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Sipariş Numarası</p>
                  <p className="font-bold">{order.id}</p>
                </div>
                <Button variant="outline" size="sm" onClick={copyOrderNumber}>
                  <Copy className="h-4 w-4 mr-2" /> Kopyala
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold mb-3">Ödeme Bilgileri</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm mb-1">
                  <strong>Banka:</strong> Örnek Bank
                </p>
                <p className="text-sm mb-1">
                  <strong>Hesap Sahibi:</strong> Divona Home Ltd. Şti.
                </p>
                <p className="text-sm mb-1">
                  <strong>IBAN:</strong> TR12 3456 7890 1234 5678 9012 34
                </p>
                <p className="text-sm font-medium mt-3 text-red-600">
                  Lütfen havale yaparken açıklama kısmına sipariş numaranızı ({order.id}) yazmayı unutmayınız.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold mb-3">Sipariş Özeti</h2>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Ürün</th>
                      <th className="px-4 py-2 text-center text-sm font-medium">Adet</th>
                      <th className="px-4 py-2 text-right text-sm font-medium">Fiyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.order_items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{item.product?.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{item.price.toLocaleString("tr-TR")} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right font-medium">
                        Ara Toplam:
                      </td>
                      <td className="px-4 py-2 text-right">{order.total_amount.toLocaleString("tr-TR")} ₺</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right font-medium">
                        Kargo:
                      </td>
                      <td className="px-4 py-2 text-right">
                        {order.shipping_cost ? `${order.shipping_cost.toLocaleString("tr-TR")} ₺` : "Ücretsiz"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right font-bold">
                        Toplam:
                      </td>
                      <td className="px-4 py-2 text-right font-bold">{order.total_amount.toLocaleString("tr-TR")} ₺</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold mb-3">Teslimat Bilgileri</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm mb-1">
                  <strong>Adres:</strong> {order.shipping_address}
                </p>
                <p className="text-sm mb-1">
                  <strong>Şehir:</strong> {order.shipping_city}
                </p>
                <p className="text-sm mb-1">
                  <strong>Posta Kodu:</strong> {order.shipping_postal_code}
                </p>
                <p className="text-sm">
                  <strong>Telefon:</strong> {order.contact_phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Ana Sayfaya Dön</Button>
              </Link>
              {user && (
                <Link href="/hesabim/siparislerim">
                  <Button>Siparişlerim</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
