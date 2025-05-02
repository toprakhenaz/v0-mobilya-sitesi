"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Save, ArrowLeft, Trash2, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCategories, getProduct, updateProduct, deleteProduct, deleteProductImage } from "@/lib/admin-service"
import type { Category, Product, ProductImage } from "@/lib/admin-service"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id, 10)
  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [stock, setStock] = useState("0")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Ürün ve kategorileri al
        const [productData, categoriesData] = await Promise.all([getProduct(productId), getCategories()])

        if (!productData) {
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Ürün bulunamadı.",
          })
          router.push("/admin/products")
          return
        }

        // Ürün verilerini ayarla
        setProduct(productData)
        setName(productData.name)
        setSlug(productData.slug)
        setDescription(productData.description || "")
        setPrice(productData.price.toString())
        setDiscountPrice(productData.discount_price ? productData.discount_price.toString() : "")
        setStock(productData.stock.toString())
        setCategoryId(productData.category_id.toString())
        setImages(productData.images || [])

        // Kategorileri ayarla
        setCategories(categoriesData)
      } catch (error) {
        console.error("Veriler alınırken hata:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Veriler alınırken bir hata oluştu.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [productId, router, toast])

  // Otomatik slug oluştur (sadece isim değiştiğinde ve slug manuel değiştirilmediyse)
  useEffect(() => {
    if (name && product && name !== product.name && slug === product.slug) {
      const slugified = name
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(slugified)
    }
  }, [name, product, slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !slug || !price || !categoryId) {
      toast({
        variant: "destructive",
        title: "Eksik Bilgi",
        description: "Lütfen gerekli tüm alanları doldurun.",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateProduct(productId, {
        name,
        slug,
        description,
        price: Number.parseFloat(price),
        discount_price: discountPrice ? Number.parseFloat(discountPrice) : null,
        stock: Number.parseInt(stock, 10),
        category_id: Number.parseInt(categoryId, 10),
      })

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi.",
      })
    } catch (error) {
      console.error("Ürün güncellenirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    setIsDeleting(true)
    try {
      await deleteProduct(productId)
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi.",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Ürün silinirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
      })
      setIsDeleting(false)
    }
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteProductImage(imageId)
      setImages(images.filter((img) => img.id !== imageId))
      toast({
        title: "Başarılı",
        description: "Resim başarıyla silindi.",
      })
    } catch (error) {
      console.error("Resim silinirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resim silinirken bir hata oluştu.",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    formData.append("productId", productId.toString())
    formData.append("image", files[0])

    try {
      const response = await fetch("/api/admin/update-product-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Resim yüklenirken bir hata oluştu")
      }

      const data = await response.json()

      // Yeni resmi images listesine ekle
      setImages([...images, data.image])

      toast({
        title: "Başarılı",
        description: "Resim başarıyla yüklendi.",
      })
    } catch (error) {
      console.error("Resim yüklenirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resim yüklenirken bir hata oluştu.",
      })
    }
  }

  const handleSetPrimaryImage = async (imageId: number) => {
    try {
      // API çağrısı yapılabilir
      // Şimdilik sadece UI'ı güncelliyoruz
      const updatedImages = images.map((img) => ({
        ...img,
        is_primary: img.id === imageId,
      }))
      setImages(updatedImages)

      toast({
        title: "Başarılı",
        description: "Ana resim güncellendi.",
      })
    } catch (error) {
      console.error("Ana resim güncellenirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ana resim güncellenirken bir hata oluştu.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ürün Düzenle</h1>
          <p className="text-muted-foreground">Ürün bilgilerini düzenleyin ve güncelleyin.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Ürünü Sil
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="images">Resimler</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Ürün Bilgileri</CardTitle>
                <CardDescription>Ürünün temel bilgilerini düzenleyin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ürün Adı</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ürün adı"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="urun-slug"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ürün açıklaması"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Fiyat (₺)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">İndirimli Fiyat (₺)</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Kaydet
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="images" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ürün Resimleri</CardTitle>
              <CardDescription>Ürün resimlerini yönetin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="image-upload">Yeni Resim Yükle</Label>
                  <div className="flex items-center">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="w-auto"
                      onChange={handleImageUpload}
                    />
                    <Button variant="outline" className="ml-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Yükle
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <div
                        className={`relative aspect-square rounded-md overflow-hidden border ${image.is_primary ? "border-primary border-2" : "border-gray-200"}`}
                      >
                        <Image src={image.url || "/placeholder.svg"} alt="Ürün resmi" fill className="object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!image.is_primary && (
                          <Button size="sm" variant="secondary" onClick={() => handleSetPrimaryImage(image.id)}>
                            Ana Resim Yap
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {image.is_primary && (
                        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          Ana Resim
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünü Sil</DialogTitle>
            <DialogDescription>Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
