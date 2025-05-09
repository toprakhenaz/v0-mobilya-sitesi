"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ProductCard from "./product-card"

type ProductCarouselProps = {
  type: "new" | "sale" | "category"
  categorySlug?: string
  limit?: number
}

type Product = {
  id: number
  name: string
  slug: string
  price: number
  original_price: number | null
  discount_percentage: number | null
  is_new: boolean
  is_on_sale: boolean
  product_images: Array<{ url: string; is_primary: boolean }>
}

export default function ProductCarousel({ type, categorySlug, limit = 8 }: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        let url = `/api/products?limit=${limit}`

        if (categorySlug) {
          url += `&category=${categorySlug}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Ürünler yüklenirken bir hata oluştu")
        }

        let data = await response.json()

        // Filtrele
        if (type === "new") {
          data = data.filter((product: Product) => product.is_new)
        } else if (type === "sale") {
          data = data.filter((product: Product) => product.is_on_sale)
        }

        setProducts(data)
        setError(null)
      } catch (err) {
        console.error("Ürünler yüklenirken hata:", err)
        setError("Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [type, categorySlug, limit])

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Ürünler yükleniyor...</div>
  }

  if (error) {
    return (
      <div className="py-12 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Yeniden Dene
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <p className="text-gray-500">Bu kategoride ürün bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            originalPrice={product.original_price}
            discountPercentage={product.discount_percentage}
            isNew={product.is_new}
            isOnSale={product.is_on_sale}
            imageUrl={product.product_images?.find((img) => img.is_primary)?.url || "/diverse-products-still-life.png"}
          />
        ))}
      </div>

      {type === "new" && (
        <div className="text-center mt-8">
          <Link
            href="/yeni-urunler"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Tüm Yeni Ürünler
          </Link>
        </div>
      )}

      {type === "sale" && (
        <div className="text-center mt-8">
          <Link
            href="/kampanyali-urunler"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Tüm Kampanyalı Ürünler
          </Link>
        </div>
      )}

      {type === "category" && categorySlug && (
        <div className="text-center mt-8">
          <Link
            href={`/kategori/${categorySlug}`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Tüm Ürünleri Gör
          </Link>
        </div>
      )}
    </div>
  )
}
