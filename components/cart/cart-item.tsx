"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem as CartItemType } from "@/contexts/cart-context"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const product = item.product

  if (!product) {
    return null
  }

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  // Ensure we have a valid image URL
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/diverse-products-still-life.png"

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b">
      {/* Product */}
      <div className="col-span-1 md:col-span-6">
        <div className="flex items-center">
          <div className="relative h-20 w-20 flex-shrink-0">
            <Image src={imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-cover rounded" />
          </div>
          <div className="ml-4">
            <Link href={`/urun/${product.slug}`} className="font-medium hover:text-primary">
              {product.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="md:col-span-2 flex items-center md:justify-center">
        <div className="md:hidden font-medium mr-2">Fiyat:</div>
        <span className="font-medium">{product.price.toLocaleString("tr-TR")} ₺</span>
      </div>

      {/* Quantity */}
      <div className="md:col-span-2 flex items-center md:justify-center">
        <div className="md:hidden font-medium mr-2">Adet:</div>
        <div className="flex border rounded">
          <button className="px-2 py-1 border-r" onClick={handleDecrement} disabled={item.quantity <= 1}>
            <Minus className="h-4 w-4" />
          </button>
          <input type="number" min="1" value={item.quantity} className="w-12 text-center py-1" readOnly />
          <button className="px-2 py-1 border-l" onClick={handleIncrement} disabled={product.stock <= item.quantity}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="md:col-span-2 flex items-center justify-between md:justify-end">
        <div className="md:hidden font-medium mr-2">Toplam:</div>
        <div className="flex items-center">
          <span className="font-medium">{(product.price * item.quantity).toLocaleString("tr-TR")} ₺</span>
          <Button variant="ghost" size="icon" className="ml-4 text-gray-400 hover:text-red-500" onClick={handleRemove}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
