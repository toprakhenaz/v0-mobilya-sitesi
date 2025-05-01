"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import HeroCarousel from "@/components/hero-carousel"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts, getSaleProducts, getCategories } from "@/lib/product-service"
import type { Product, Category } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

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
        setCategories(categoriesData)
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

      {/* Kategoriler */}
      <section className="py-10 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className="py-10">
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

      {/* Kampanyalı Ürünler */}
      <section className="py-10 bg-accent">
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

      {/* Bilgi Bölümü */}
      <section className="py-10">
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
