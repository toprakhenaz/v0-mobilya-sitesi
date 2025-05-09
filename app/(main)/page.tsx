"use client"

import { Suspense } from "react"
import HeroCarouselDynamic from "@/components/hero-carousel-dynamic"
import CategoryShowcase from "@/components/category-showcase"
import ProductCarousel from "@/components/product-carousel"
import Testimonials from "@/components/testimonials"
import Newsletter from "@/components/newsletter"

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

// Fallback categories if API fails
const fallbackCategories = [
  {
    id: 1,
    name: "Bahçe Oturma Grupları",
    slug: "bahce-oturma-gruplari",
    image_url: "/categories/bahce-oturma-gruplari.jpg",
  },
  {
    id: 2,
    name: "Bahçe Köşe Takımları",
    slug: "bahce-kose-takimlari",
    image_url: "/categories/bahce-kose-takimlari.jpg",
  },
  {
    id: 3,
    name: "Masa Takımları",
    slug: "masa-takimlari",
    image_url: "/categories/masa-takimlari.jpg",
  },
  {
    id: 4,
    name: "Şezlonglar",
    slug: "sezlonglar",
    image_url: "/categories/sezlonglar.jpg",
  },
  {
    id: 5,
    name: "Sandalyeler",
    slug: "sandalyeler",
    image_url: "/categories/sandalyeler.png",
  },
]

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Yükleniyor...</div>}>
        <HeroCarouselDynamic />
      </Suspense>

      <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Kategoriler yükleniyor...</div>}>
        <CategoryShowcase />
      </Suspense>

      <section className="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Yeni Ürünler</h2>
        <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Ürünler yükleniyor...</div>}>
          <ProductCarousel type="new" />
        </Suspense>
      </section>

      <section className="py-12 px-4 md:px-8 lg:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Kampanyalı Ürünler</h2>
        <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Ürünler yükleniyor...</div>}>
          <ProductCarousel type="sale" />
        </Suspense>
      </section>

      <Testimonials />
      <Newsletter />
    </main>
  )
}
