import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/supabase"

interface ProductCardProps {
  product: Product
  showQuickActions?: boolean
}

const ProductCard = ({ product, showQuickActions = false }: ProductCardProps) => {
  // Get the first image from the product's images array
  // Images are now coming directly from the database via the image_urls field
  const productImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"

  return (
    <div className="group">
      <Link href={`/urun/${product.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          {/* Product Image */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={true} // Add priority to ensure images load quickly
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_new && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">Yeni</span>
              )}
              {product.is_on_sale && product.discount_percentage && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  %{product.discount_percentage}
                </span>
              )}
            </div>

            {/* Quick Actions - Conditional */}
            {showQuickActions && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white text-gray-700 rounded-full h-8 w-8 shadow-md hover:text-primary"
                >
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Favorilere Ekle</span>
                </Button>
              </div>
            )}

            {/* Quick Add to Cart - Conditional */}
            {showQuickActions && (
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 px-3 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <Button className="w-full flex items-center justify-center gap-2 text-sm h-9">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Sepete Ekle</span>
                </Button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center mt-2">
              <span className="text-lg font-bold text-primary">{product.price.toLocaleString("tr-TR")} ₺</span>

              {product.original_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {product.original_price.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
