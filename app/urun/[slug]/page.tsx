"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Truck, ShieldCheck, Heart, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getProductBySlug, getProducts } from "@/lib/product-service"
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist-service"
import type { Product } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductBySlug(params.slug)
        setProduct(productData)

        // Get related products
        if (productData) {
          const { products } = await getProducts(undefined, undefined, 1, 4)
          setRelatedProducts(products.filter((p) => p.id !== productData.id).slice(0, 3))
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Hata",
          description: "Ürün bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !product) return

      setIsCheckingFavorite(true)
      try {
        const result = await isInWishlist(user.id, product.id)
        setIsFavorite(result)
      } catch (error) {
        console.error("Error checking wishlist:", error)
      } finally {
        setIsCheckingFavorite(false)
      }
    }

    checkWishlist()
  }, [user, product])

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && (!product || value <= product.stock)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      await addToCart(product.id, quantity)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Giriş Yapın",
        description: "Favorilere eklemek için giriş yapmalısınız.",
      })
      return
    }

    if (!product) return

    try {
      if (isFavorite) {
        await removeFromWishlist(user.id, product.id)
        setIsFavorite(false)
        toast({
          title: "Başarılı",
          description: "Ürün favorilerden kaldırıldı.",
        })
      } else {
        await addToWishlist(user.id, product.id)
        setIsFavorite(true)
        toast({
          title: "Başarılı",
          description: "Ürün favorilere eklendi.",
        })
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Ürün bulunamadı</h2>
        <p className="text-gray-600 mb-6">Aradığınız ürün bulunamadı veya kaldırılmış olabilir.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  // Ensure we have a valid image URL
  const imageUrl = product.images && product.images.length > 0 ? product.images[currentImage] : "/placeholder.svg"

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/kategori/${product.category_id}`} className="hover:text-primary">
            Kategori
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative h-[300px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image src={imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 border-2 rounded ${
                      currentImage === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-primary mr-3">{product.price.toLocaleString("tr-TR")} ₺</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-gray-500 line-through mr-2">
                    {product.original_price.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    %{product.discount_percentage}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">✓ Stokta ({product.stock} adet)</span>
              ) : (
                <span className="text-red-600 font-medium">✗ Stokta Yok</span>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Adet</label>
              <div className="flex border rounded-md max-w-[150px]">
                <button
                  className="px-4 py-2 border-r"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-full text-center py-2"
                />
                <button
                  className="px-4 py-2 border-l"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>{product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={handleToggleWishlist}
                disabled={isCheckingFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}</span>
              </Button>
            </div>

            {/* Shipping & Payment */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Kargo Bilgisi</h3>
                  <p className="text-sm text-gray-600">5000 TL ve üzeri siparişlerde ücretsiz kargo</p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Ödeme Yöntemi</h3>
                  <p className="text-sm text-gray-600">Banka havalesi / EFT ile güvenli ödeme</p>
                </div>
              </div>
            </div>

            {/* IBAN Info */}
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-2">Banka Hesap Bilgileri</h3>
              <p className="text-sm mb-1">
                <strong>Banka:</strong> Örnek Bank
              </p>
              <p className="text-sm mb-1">
                <strong>Hesap Sahibi:</strong> Divona Home Ltd. Şti.
              </p>
              <p className="text-sm">
                <strong>IBAN:</strong> TR12 3456 7890 1234 5678 9012 34
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b mb-6">
            <div className="inline-block border-b-2 border-primary pb-2 font-medium">Ürün Özellikleri</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-bold mb-4">Özellikler</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-bold mb-4">Teknik Özellikler</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 border-b pb-2">
                      <span className="font-medium">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
