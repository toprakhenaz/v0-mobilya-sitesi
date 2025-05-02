"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Clock, FileText, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getOrderDetails, updateOrderStatus, type Order } from "@/lib/admin-service"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(Number(params.id))
    }
  }, [params.id])

  async function fetchOrderDetails(orderId: number) {
    setLoading(true)
    try {
      const orderData = await getOrderDetails(orderId)
      setOrder(orderData)
    } catch (error) {
      console.error("Sipariş detayları alınırken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş detayları alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(status: string) {
    if (!order) return

    setUpdating(true)
    try {
      const success = await updateOrderStatus(Number(order.id), status)
      if (success) {
        toast({
          title: "Başarılı",
          description: "Sipariş durumu güncellendi.",
        })
        // Refresh order details
        fetchOrderDetails(Number(order.id))
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Sipariş durumu güncellenirken bir hata oluştu.",
        })
      }
    } catch (error) {
      console.error("Sipariş durumu güncellenirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş durumu güncellenirken bir hata oluştu.",
      })
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Beklemede
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <FileText className="mr-1 h-3 w-3" />
            İşleniyor
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            <Truck className="mr-1 h-3 w-3" />
            Kargoya Verildi
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Teslim Edildi
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            İptal Edildi
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px]">
          <h2 className="text-2xl font-bold">Sipariş Bulunamadı</h2>
          <p className="text-muted-foreground">İstediğiniz sipariş bulunamadı veya erişim izniniz yok.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Siparişlere Dön
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sipariş Durumu:</span>
          <Select value={order.status} onValueChange={handleStatusChange} disabled={updating}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="processing">İşleniyor</SelectItem>
              <SelectItem value="shipped">Kargoya Verildi</SelectItem>
              <SelectItem value="delivered">Teslim Edildi</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Bilgileri</CardTitle>
            <CardDescription>Sipariş detayları ve durumu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sipariş No</p>
                <p className="font-medium">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durum</p>
                <div>{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tarih</p>
                <p>{new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ödeme Yöntemi</p>
                <p>
                  {order.payment_method === "bank_transfer"
                    ? "Havale/EFT"
                    : order.payment_method === "credit_card"
                      ? "Kredi Kartı"
                      : order.payment_method === "cash_on_delivery"
                        ? "Kapıda Ödeme"
                        : order.payment_method}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
            <CardDescription>Müşteri ve teslimat bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Müşteri</p>
              <p className="font-medium">{order.user_email || "Misafir Kullanıcı"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teslimat Adresi</p>
              <p className="whitespace-pre-wrap">{order.shipping_address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sipariş Ürünleri</CardTitle>
          <CardDescription>Sipariş edilen ürünler ve detayları</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead className="text-right">Adet</TableHead>
                <TableHead className="text-right">Birim Fiyat</TableHead>
                <TableHead className="text-right">Toplam</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.product ? (
                        <div className="font-medium">{item.product.name}</div>
                      ) : (
                        <div className="font-medium">Ürün #{item.product_id}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.price.toFixed(2)} ₺</TableCell>
                    <TableCell className="text-right">{(item.price * item.quantity).toFixed(2)} ₺</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Ürün bilgisi bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          <div className="flex justify-end">
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-muted-foreground">Toplam Tutar</p>
              <p className="text-2xl font-bold">{order.total_amount.toFixed(2)} ₺</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
