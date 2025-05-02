"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Loader2, CheckCircle, Truck, Package, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-client"
import type { Order } from "@/lib/order-service"

export default function OrderTracking() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialOrderId = searchParams.get("order_id")

  const [orderNumber, setOrderNumber] = useState(initialOrderId || "")
  const [contactPhone, setContactPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)

  // Auto-search if order_id is provided in URL
  useEffect(() => {
    if (initialOrderId) {
      handleSearch()
    }
  }, [initialOrderId])

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)

    if (!orderNumber) {
      setError("Lütfen sipariş numarası girin.")
      setIsLoading(false)
      return
    }

    try {
      // Directly fetch the order by ID without requiring login
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq("id", Number(orderNumber))
        .single()

      if (orderError || !orderData) {
        setError("Belirtilen sipariş numarası ile eşleşen sipariş bulunamadı.")
        setIsLoading(false)
        return
      }

      // If contact phone is provided, verify it matches
      if (contactPhone && orderData.contact_phone !== contactPhone) {
        setError("Girdiğiniz telefon numarası bu sipariş ile eşleşmiyor.")
        setIsLoading(false)
        return
      }

      setOrder(orderData as Order)
    } catch (error) {
      console.error("Sipariş aranırken hata:", error)
      setError("Sipariş aranırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500" />
      case "processing":
        return <Package className="h-8 w-8 text-blue-500" />
      case "shipped":
        return <Truck className="h-8 w-8 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      default:
        return <Clock className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Sipariş Alındı"
      case "processing":
        return "Hazırlanıyor"
      case "shipped":
        return "Kargoya Verildi"
      case "delivered":
        return "Teslim Edildi"
      default:
        return "Beklemede"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Siparişiniz alındı ve ödeme onayı bekleniyor."
      case "processing":
        return "Ödemeniz onaylandı ve siparişiniz hazırlanıyor."
      case "shipped":
        return "Siparişiniz kargoya verildi ve yolda."
      case "delivered":
        return "Siparişiniz teslim edildi."
      default:
        return "Siparişiniz işleme alındı."
    }
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Sipariş Takibi</h1>

          {!order ? (
            <div className="bg-white p-6 rounded-lg shadow-card">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orderNumber">Sipariş Numarası</Label>
                    <Input
                      id="orderNumber"
                      type="text"
                      placeholder="Örn: 12345"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Telefon Numarası (İsteğe Bağlı)</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="Siparişi verdiğiniz telefon numarası"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Ek doğrulama için telefon numaranızı girebilirsiniz.</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aranıyor...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Siparişi Ara
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 border-t pt-6">
                <h2 className="font-semibold mb-4">Siparişinizi bulamıyor musunuz?</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Siparişinizle ilgili sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
                </p>
                <Link href="/iletisim">
                  <Button variant="outline" size="sm">
                    İletişime Geç
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg">Sipariş #{order.id}</h2>
                  <span className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>

              {/* Sipariş Durumu */}
              <div className="p-6 bg-gray-50">
                <div className="flex items-center mb-4">
                  {getStatusIcon(order.status)}
                  <div className="ml-4">
                    <h3 className="font-bold">{getStatusText(order.status)}</h3>
                    <p className="text-gray-600">{getStatusDescription(order.status)}</p>
                  </div>
                </div>

                {/* İlerleme Çubuğu */}
                <div className="relative pt-4">
                  <div className="flex mb-2 items-center justify-between">
                    <div
                      className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                        order.status !== "pending" ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      Sipariş Alındı
                    </div>
                    <div
                      className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                        order.status === "processing" || order.status === "shipped" || order.status === "delivered"
                          ? "bg-green-200 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      Hazırlanıyor
                    </div>
                    <div
                      className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                        order.status === "shipped" || order.status === "delivered"
                          ? "bg-green-200 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      Kargoya Verildi
                    </div>
                    <div
                      className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                        order.status === "delivered" ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      Teslim Edildi
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{
                        width:
                          order.status === "pending"
                            ? "25%"
                            : order.status === "processing"
                              ? "50%"
                              : order.status === "shipped"
                                ? "75%"
                                : "100%",
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Kargo Takip Numarası:</span> {order.tracking_number}
                    </p>
                    {order.shipping_company && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Kargo Firması:</span> {order.shipping_company}
                      </p>
                    )}
                    {order.estimated_delivery && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Tahmini Teslimat:</span>{" "}
                        {new Date(order.estimated_delivery).toLocaleDateString("tr-TR")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Sipariş Detayları */}
              <div className="p-6">
                <h3 className="font-bold mb-4">Sipariş Detayları</h3>

                {order.order_items && order.order_items.length > 0 ? (
                  <div className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center border-b pb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 relative">
                          {item.product && item.product.images && item.product.images[0] && (
                            <img
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              className="object-cover rounded-md"
                              style={{ width: "100%", height: "100%" }}
                            />
                          )}
                        </div>
                        <div className="ml-4 flex-grow">
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.price.toLocaleString("tr-TR")} ₺</p>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Ara Toplam:</span>
                        <span>
                          {order.order_items
                            .reduce((sum, item) => sum + item.price * item.quantity, 0)
                            .toLocaleString("tr-TR")}{" "}
                          ₺
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Kargo:</span>
                        <span>
                          {(
                            order.total_amount -
                            order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                          ).toLocaleString("tr-TR")}{" "}
                          ₺
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Toplam:</span>
                        <span>{order.total_amount.toLocaleString("tr-TR")} ₺</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Sipariş detayları bulunamadı.</p>
                )}
              </div>

              {/* Teslimat Bilgileri */}
              <div className="p-6 border-t">
                <h3 className="font-bold mb-4">Teslimat Bilgileri</h3>
                <p className="mb-1">{order.shipping_address}</p>
                <p className="mb-1">
                  {order.shipping_city}, {order.shipping_postal_code}
                </p>
                <p className="mb-1">{order.shipping_country}</p>
                <p className="mb-1">Telefon: {order.contact_phone}</p>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                <Button variant="outline" onClick={() => setOrder(null)}>
                  Başka Bir Sipariş Ara
                </Button>
                <Link href="/iletisim">
                  <Button>Yardım Al</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
