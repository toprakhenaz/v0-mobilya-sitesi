import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/supabase"

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Ürünün ilk resmini al
  let productImage = "/placeholder.svg"

  // Önce image_urls alanını kontrol et
  if (product.image_urls && product.image_urls.length > 0) {
    productImage = product.image_urls[0]
  }
  // Sonra images alanını kontrol et
  else if (product.images && product.images.length > 0) {
    productImage = product.images[0]
  }

  // Ürünün indirimli fiyatını hesapla
  const discountedPrice = product.discount_percentage
    ? product.price - (product.price * product.discount_percentage) / 100
    : product.price

  return (
    <Link href={`/urun/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        {/* Product Image */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={true} // Add priority to ensure images load quickly
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && <span className="badge-new">Yeni</span>}
            {product.is_on_sale && product.discount_percentage && (
              <span className="badge-discount">%{product.discount_percentage}</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center mt-2">
            <span className="text-lg font-bold text-primary">{discountedPrice.toLocaleString("tr-TR")} ₺</span>

            {product.discount_percentage && product.discount_percentage > 0 && (
              <span className="text-sm text-gray-500 line-through ml-2">{product.price.toLocaleString("tr-TR")} ₺</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
