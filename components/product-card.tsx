import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  discountPercentage?: number | null
  isNew?: boolean
  isOnSale?: boolean
  imageUrl: string
}

const ProductCard = ({
  name,
  slug,
  price,
  originalPrice,
  discountPercentage,
  isNew = false,
  isOnSale = false,
  imageUrl,
}: ProductCardProps) => {
  return (
    <Link href={`/urun/${slug}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(name + " furniture")}`}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {isNew && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Yeni</div>
          )}

          {isOnSale && discountPercentage && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              %{discountPercentage} İndirim
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium mb-2 line-clamp-2">{name}</h3>

          <div className="flex items-center">
            <span className="text-lg font-bold text-primary">{price.toLocaleString("tr-TR")} ₺</span>

            {isOnSale && originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">{originalPrice.toLocaleString("tr-TR")} ₺</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
