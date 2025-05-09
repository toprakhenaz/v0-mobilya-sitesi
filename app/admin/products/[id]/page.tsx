"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Save, ArrowLeft, Trash2, Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  getCategories,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  createProduct,
} from "@/lib/admin-service"
import type { Category, Product, ProductImage } from "@/lib/admin-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const isNewProduct = params.id === "new"
  const productId = isNewProduct ? 0 : Number.parseInt(params.id, 10)

  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState("")
  const [isOnSale, setIsOnSale] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [stock, setStock] = useState("0")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [tempImages, setTempImages] = useState<File[]>([])
  const [tempImagePreviews, setTempImagePreviews] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Add refs to track manual changes
  const priceChangedManually = useRef(false)
  const originalPriceChangedManually = useRef(false)
  const discountChangedManually = useRef(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Kategorileri her zaman al
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Eğer yeni ürün oluşturuluyorsa, ürün verisi alma
        if (isNewProduct) {
          setIsLoading(false)
          return
        }

        // Mevcut ürünü al
        const productData = await getProduct(productId)

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
        setOriginalPrice(productData.original_price ? productData.original_price.toString() : "")
        setDiscountPercentage(productData.discount_percentage ? productData.discount_percentage.toString() : "")
        setIsOnSale(productData.is_on_sale || false)
        setIsNew(productData.is_new || false)
        setStock(productData.stock.toString())
        setCategoryId(productData.category_id.toString())
        setImages(productData.images || [])
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
  }, [productId, router, toast, isNewProduct])

  // Otomatik slug oluştur (sadece isim değiştiğinde ve slug manuel değiştirilmediyse)
  useEffect(() => {
    if (name && ((product && name !== product.name && slug === product.slug) || (!product && !slug))) {
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

  // İndirim yüzdesi hesapla - only when original price is changed manually
  useEffect(() => {
    if (originalPriceChangedManually.current && price && originalPrice && Number(originalPrice) > Number(price)) {
      discountChangedManually.current = false
      const discount = Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      setDiscountPercentage(discount.toString())
    }
    // Reset the flag after the effect runs
    originalPriceChangedManually.current = false
  }, [price, originalPrice])

  // Orijinal fiyatı hesapla - only when discount percentage is changed manually
  useEffect(() => {
    if (discountChangedManually.current && price && discountPercentage && Number(discountPercentage) > 0) {
      originalPriceChangedManually.current = false
      const original = Math.round((Number(price) * 100) / (100 - Number(discountPercentage)))
      setOriginalPrice(original.toString())
    }
    // Reset the flag after the effect runs
    discountChangedManually.current = false
  }, [price, discountPercentage])

  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    priceChangedManually.current = true
    setPrice(e.target.value)
  }

  // Handle original price change
  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalPriceChangedManually.current = true
    setOriginalPrice(e.target.value)
  }

  // Handle discount percentage change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    discountChangedManually.current = true
    setDiscountPercentage(e.target.value)
  }

  const handleTempImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setTempImages((prev) => [...prev, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setTempImagePreviews((prev) => [...prev, ...newPreviews])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveTempImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(tempImagePreviews[index])

    setTempImages((prev) => prev.filter((_, i) => i !== index))
    setTempImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadProductImages = async (productId: number, files: File[]): Promise<boolean> => {
    setUploadError(null)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("productId", productId.toString())
        formData.append("image", file)

        const response = await fetch("/api/admin/upload-product-image", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          console.error("Image upload failed:", data)
          throw new Error(data.error || "Resim yüklenirken bir hata oluştu")
        }

        // If this was successful, add the image to the images state
        if (data.success && data.image) {
          setImages((prevImages) => [...prevImages, data.image])
        }

        // If there's a note, it means we used the fallback method
        if (data.note) {
          console.warn("Image upload note:", data.note)
        }
      }
      return true
    } catch (error) {
      console.error("Resimler yüklenirken hata:", error)
      setUploadError(error instanceof Error ? error.message : "Resim yüklenirken bir hata oluştu")
      return false
    }
  }

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
      const productData = {
        name,
        slug,
        description,
        price: Number.parseFloat(price),
        original_price: originalPrice ? Number.parseFloat(originalPrice) : null,
        discount_percentage: discountPercentage ? Number.parseInt(discountPercentage, 10) : null,
        is_new: isNew,
        is_on_sale: isOnSale,
        stock: Number.parseInt(stock, 10),
        category_id: Number.parseInt(categoryId, 10),
      }

      if (isNewProduct) {
        // Yeni ürün oluştur
        const newProduct = await createProduct(productData)
        if (newProduct) {
          // Eğer geçici resimler varsa, yükle
          if (tempImages.length > 0) {
            const uploadSuccess = await uploadProductImages(newProduct.id, tempImages)
            if (!uploadSuccess) {
              toast({
                variant: "destructive",
                title: "Uyarı",
                description: "Ürün oluşturuldu ancak bazı resimler yüklenemedi.",
              })
            }
          }

          toast({
            title: "Başarılı",
            description: "Ürün başarıyla oluşturuldu.",
          })
          router.push(`/admin/products/${newProduct.id}`)
        }
      } else {
        // Mevcut ürünü güncelle
        await updateProduct(productId, productData)

        // If there are temporary images, upload them
        if (tempImages.length > 0) {
          const uploadSuccess = await uploadProductImages(productId, tempImages)
          if (!uploadSuccess) {
            toast({
              variant: "destructive",
              title: "Uyarı",
              description: "Ürün güncellendi ancak bazı resimler yüklenemedi.",
            })
          }
        }

        toast({
          title: "Başarılı",
          description: "Ürün başarıyla güncellendi.",
        })
      }
    } catch (error) {
      console.error(isNewProduct ? "Ürün oluşturulurken hata:" : "Ürün güncellenirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: isNewProduct ? "Ürün oluşturulurken bir hata oluştu." : "Ürün güncellenirken bir hata oluştu.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (isNewProduct) return

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
    setUploadError(null)

    if (isNewProduct) {
      handleTempImageUpload(e)
      return
    }

    const files = e.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    formData.append("productId", productId.toString())
    formData.append("image", files[0])

    try {
      const response = await fetch("/api/admin/upload-product-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Resim yüklenirken bir hata oluştu")
      }

      // Yeni resmi images listesine ekle
      setImages([...images, data.image])

      // If there's a note, it means we used the fallback method
      if (data.note) {
        console.warn("Image upload note:", data.note)
        toast({
          title: "Bilgi",
          description: "Resim alternatif yöntemle kaydedildi. Bazı özellikler sınırlı olabilir.",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Resim başarıyla yüklendi.",
        })
      }
    } catch (error) {
      console.error("Resim yüklenirken hata:", error)
      setUploadError(error instanceof Error ? error.message : "Resim yüklenirken bir hata oluştu")
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
          <h1 className="text-2xl font-bold tracking-tight">{isNewProduct ? "Yeni Ürün Ekle" : "Ürün Düzenle"}</h1>
          <p className="text-muted-foreground">
            {isNewProduct ? "Yeni bir ürün ekleyin." : "Ürün bilgilerini düzenleyin ve güncelleyin."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </Link>
          {!isNewProduct && (
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Ürünü Sil
            </Button>
          )}
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
                <CardTitle>{isNewProduct ? "Yeni Ürün Bilgileri" : "Ürün Bilgileri"}</CardTitle>
                <CardDescription>
                  {isNewProduct ? "Yeni ürünün temel bilgilerini girin." : "Ürünün temel bilgilerini düzenleyin."}
                </CardDescription>
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
                    <Label htmlFor="price">Satış Fiyatı (₺)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={handlePriceChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Normal Fiyat (₺)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={originalPrice}
                      onChange={handleOriginalPriceChange}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">İndirimli ürünler için normal fiyat</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage">İndirim Yüzdesi (%)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      min="0"
                      max="99"
                      value={discountPercentage}
                      onChange={handleDiscountChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label className="block mb-2">Yeni Ürün</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="is-new" checked={isNew} onCheckedChange={setIsNew} />
                      <Label htmlFor="is-new">Yeni ürün olarak işaretle</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="block mb-2">İndirimde</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="is-on-sale" checked={isOnSale} onCheckedChange={setIsOnSale} />
                      <Label htmlFor="is-on-sale">İndirimde olarak işaretle</Label>
                    </div>
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
                      {isNewProduct ? "Oluşturuluyor" : "Kaydediliyor"}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isNewProduct ? "Oluştur" : "Kaydet"}
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
              <CardDescription>
                {isNewProduct
                  ? "Ürün için resimler ekleyin. Ürün kaydedildikten sonra yüklenecektir."
                  : "Ürün resimlerini yönetin."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Hata</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="image-upload">
                    {isNewProduct ? "Resim Ekle (Ürün kaydedildiğinde yüklenecek)" : "Yeni Resim Yükle"}
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="w-auto"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                    <Button variant="outline" className="ml-2" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Seç
                    </Button>
                  </div>
                </div>

                {isNewProduct ? (
                  // Yeni ürün için geçici resim önizlemeleri
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tempImagePreviews.length === 0 ? (
                      <div className="col-span-full text-center p-8 border border-dashed rounded-md">
                        <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Henüz resim eklenmedi</p>
                      </div>
                    ) : (
                      tempImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={preview || "/placeholder.svg"}
                              alt="Ürün resmi önizleme"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveTempImage(index)}
                              className="absolute top-2 right-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  // Mevcut ürün için resimler
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.length === 0 ? (
                      <div className="col-span-full text-center p-8 border border-dashed rounded-md">
                        <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Henüz resim eklenmedi</p>
                      </div>
                    ) : (
                      images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div
                            className={`relative aspect-square rounded-md overflow-hidden border ${
                              image.is_primary ? "border-primary border-2" : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt="Ürün resmi"
                              fill
                              className="object-cover"
                            />
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
                      ))
                    )}
                  </div>
                )}
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
