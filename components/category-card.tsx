import Link from "next/link"
import Image from "next/image"

interface CategoryCardProps {
  name: string
  slug: string
  imageUrl: string
}

const CategoryCard = ({ name, slug, imageUrl }: CategoryCardProps) => {
  return (
    <Link href={`/kategori/${slug}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(name + " furniture")}`}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-lg font-bold text-center px-2">{name}</h3>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard
