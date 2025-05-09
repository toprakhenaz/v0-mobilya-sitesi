"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import CategoryCard from "./category-card"

type Category = {
  id: number
  name: string
  slug: string
  image_url: string | null
}

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/categories")

        if (!response.ok) {
          throw new Error("Kategoriler yüklenirken bir hata oluştu")
        }

        const data = await response.json()
        setCategories(data)
        setError(null)
      } catch (err) {
        console.error("Kategoriler yüklenirken hata:", err)
        setError("Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Kategoriler yükleniyor...</div>
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

  return (
    <section className="py-12 px-4 md:px-8 lg:px-12 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">Popüler Kategoriler</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            slug={category.slug}
            imageUrl={category.image_url || `/categories/${category.slug}.jpg`}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/kategoriler"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Tüm Kategoriler
        </Link>
      </div>
    </section>
  )
}
