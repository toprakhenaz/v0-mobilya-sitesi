"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Search, AlertCircle } from "lucide-react"
import { getOrderById } from "@/lib/order-service"

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any | null>(null)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      setError("Lütfen bir sipariş numarası girin.")
      return
    }

    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const orderData = await getOrderById(Number.parseInt(orderNumber))

      if (!orderData) {
        setError("Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.")
        return
      }

      setOrder(orderData)
    } catch (err) {
      console.error("Sipariş arama hatası:", err)
      setError("Sipariş aranırken bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = () => {
    if (order) {
      router.push(`/hesabim/siparislerim/${order.id}`)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede"
      case "processing":
        return "İşleniyor"
      case "shipped":
        return "Kargoya Verildi"
      case "delivered":
        return "Teslim Edildi"
      case "cancelled":
        return "İptal Edildi"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Sipariş Takibi</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Siparişinizi Takip Edin</CardTitle>
          <CardDescription>Sipariş numaranızı girerek siparişinizin durumunu kontrol edebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="orderNumber" className="sr-only">
                Sipariş Numarası
              </Label>
              <Input
                id="orderNumber"
                placeholder="Sipariş numaranızı girin"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aranıyor
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Ara
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {order && (
        <Card>
          <CardHeader>
            <CardTitle>Sipariş #{order.id}</CardTitle>
            <CardDescription>Sipariş Tarihi: {new Date(order.created_at).toLocaleDateString("tr-TR")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Durum</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Toplam Tutar</h3>
                <p className="font-medium">{order.total_amount.toLocaleString("tr-TR")} ₺</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-500">Teslimat Adresi</h3>
              <p className="text-sm mt-1">{order.shipping_address}</p>
            </div>

            {order.items && order.items.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-2">Sipariş Ürünleri</h3>
                <ul className="space-y-2">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="text-sm border-b pb-2">
                      {item.product?.name || "Ürün"} x {item.quantity} - {item.price.toLocaleString("tr-TR")} ₺
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleViewDetails} variant="outline">
              Detayları Görüntüle
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
