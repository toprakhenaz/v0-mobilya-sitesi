import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/supabase"

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

interface CategoryCardProps {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Get image URL from mapping or use placeholder
  const imageUrl =
    category.image_url ||
    categoryImages[category.slug] ||
    `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(category.name + " furniture")}`

  return (
    <Link href={`/kategori/${category.slug}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative h-40 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 group-hover:from-black/70 transition-all duration-300"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-lg font-bold text-center px-2 transform group-hover:scale-105 transition-transform duration-300">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
