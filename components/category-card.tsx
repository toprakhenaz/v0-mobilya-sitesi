import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/supabase"

interface CategoryCardProps {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/kategori/${category.slug}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-card">
        <div className="relative h-40 w-full">
          <Image
            src={category.image_url || "/placeholder.svg?height=300&width=300&query=garden furniture category"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-lg font-bold text-center px-2">{category.name}</h3>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
