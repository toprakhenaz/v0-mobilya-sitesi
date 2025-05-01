"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import HeroCarousel from "@/components/hero-carousel"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts, getSaleProducts, getCategories } from "@/lib/product-service"
import type { Product, Category } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

// Category image mapping
const categoryImages: Record<string, string> = {
  "bahce-oturma-gruplari": "/categories/bahce-oturma-gruplari.jpg",
  "bahce-kose-takimlari": "/categories/bahce-kose-takimlari.jpg",
  "masa-takimlari": "/categories/masa-takimlari.jpg",
  sezlonglar: "/categories/sezlonglar.jpg",
  "luks-oturma-odasi": "/luxury-living-room.png",
  "luks-yemek-odasi": "/luxury-dining-room.png",
  "executive-ofis": "/executive-office-furniture.png",
  "premium-yatak-odasi": "/premium-bedroom-furniture.png",
  "ozel-tasarim": "/custom-furniture-design.png",
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products (newest products)
        const featured = await getFeaturedProducts(4)
        setFeaturedProducts(featured)

        // Fetch sale products
        const sale = await getSaleProducts(4)
        setSaleProducts(sale)

        // Fetch categories
        const categoriesData = await getCategories()

        // Add image URLs to categories if they don't have one
        const categoriesWithImages = categoriesData.map((category) => {
          if (!category.image_url) {
            return {
              ...category,
              image_url:
                categoryImages[category.slug] ||
                `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(category.name + " furniture")}`,
            }
          }
          return category
        })

        setCategories(categoriesWithImages)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <HeroCarousel />

      {/* Kategoriler - Smaller and at the top */}
      <section className="py-6 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-xl font-bold mb-4">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/kategori/${category.slug}`}
                className="group relative overflow-hidden rounded-lg h-24 flex items-center justify-center"
              >
                <Image
                  src={
                    category.image_url ||
                    `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(category.name + " furniture")}`
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30"></div>
                <h3 className="relative z-10 text-white text-center font-medium px-2">{category.name}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link href="/kategoriler">
              <Button variant="outline" size="sm">
                Tüm Kategoriler
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Kampanyalı Ürünler - Now first */}
      <section className="py-8 bg-accent">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Kampanyalı Ürünler</h2>
            <Link href="/kampanyali-urunler" className="text-primary hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler - Now second */}
      <section className="py-8">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/urunler">
              <Button variant="outline" size="lg">
                Tüm Ürünleri Gör
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bilgi Bölümü */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="text-primary text-4xl mb-4">✓</div>
              <h3 className="font-bold text-lg mb-2">Kaliteli Ürünler</h3>
              <p className="text-gray-600">En kaliteli malzemelerden üretilen dayanıklı bahçe mobilyaları</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="text-primary text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-lg mb-2">Ücretsiz Kargo</h3>
              <p className="text-gray-600">5000 TL ve üzeri siparişlerde Türkiye'nin her yerine ücretsiz kargo</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="text-primary text-4xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-600">Banka havalesi/EFT ile güvenli ödeme imkanı</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
