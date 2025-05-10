"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Clock,
  FileText,
  Truck,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getOrderDetails, updateOrderStatus, type Order } from "@/lib/admin-service"
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [isUploading, setIsUploading] = useState(false)
  const [orderImages, setOrderImages] = useState<any[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsUploading(true)

    try {
      // Önizleme için URL oluştur
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Resmi sunucuya yükle
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/admin/upload-order-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Resim yüklenirken bir hata oluştu")
      }

      const data = await response.json()

      if (data.success) {
        // Add the image to the order
        const addImageResponse = await fetch(`/api/orders/${order.id}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: data.imageUrl,
            description: "Sipariş resmi",
          }),
        })

        if (!addImageResponse.ok) {
          throw new Error("Resim siparişe eklenirken bir hata oluştu")
        }

        const addImageData = await addImageResponse.json()

        // Add the new image to the state
        setOrderImages([...orderImages, addImageData.image])

        toast({
          title: "Başarılı",
          description: "Resim başarıyla yüklendi.",
        })
      } else {
        throw new Error(data.error || "Resim yüklenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Resim yükleme hatası:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resim yüklenirken bir hata oluştu.",
      })
      // Hata durumunda önizlemeyi temizle
      setPreviewImage(null)
    } finally {
      setIsUploading(false)
      // Dosya seçiciyi sıfırla
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/orders/${order.id}/images/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Resim silinirken bir hata oluştu")
      }

      // Remove the image from the state
      setOrderImages(orderImages.filter((img) => img.id !== imageId))

      toast({
        title: "Başarılı",
        description: "Resim başarıyla silindi.",
      })
    } catch (error) {
      console.error("Resim silme hatası:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resim silinirken bir hata oluştu.",
      })
    }
  }

  useEffect(() => {
    const fetchOrderImages = async () => {
      try {
        const response = await fetch(`/api/orders/${order.id}/images`)
        if (!response.ok) {
          throw new Error("Sipariş resimleri alınırken bir hata oluştu")
        }

        const data = await response.json()
        setOrderImages(data.images || [])
      } catch (error) {
        console.error("Sipariş resimleri alınırken hata:", error)
      }
    }

    if (order?.id) {
      fetchOrderImages()
    }
  }, [order?.id])

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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sipariş Resimleri</CardTitle>
          <CardDescription>Siparişe ait resimler (teslimat kanıtı, vb.)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Resim Yükle
                  </>
                )}
              </Button>
            </div>

            {previewImage && (
              <div className="relative w-full max-w-md h-40 rounded-md overflow-hidden border">
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Sipariş resmi önizleme"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {orderImages.length === 0 ? (
                <div className="col-span-full text-center p-8 border border-dashed rounded-md">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Henüz resim eklenmedi</p>
                </div>
              ) : (
                orderImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative aspect-square rounded-md overflow-hidden border">
                      <Image src={image.url || "/placeholder.svg"} alt="Sipariş resmi" fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {image.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">{image.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
