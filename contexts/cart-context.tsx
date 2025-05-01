"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "./auth-context"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/supabase"

// Define types
export type CartItem = {
  id: number
  product_id: number
  quantity: number
  product?: Product
}

type CartContextType = {
  cartItems: CartItem[]
  isLoading: boolean
  addToCart: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  subtotal: number
  shipping: number
  total: number
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart items when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true)

      if (!user) {
        // Load from localStorage for non-authenticated users
        const localCart = localStorage.getItem("cart")
        if (localCart) {
          try {
            const parsedCart = JSON.parse(localCart)

            // Fetch product details for each cart item
            const itemsWithProducts = await Promise.all(
              parsedCart.map(async (item: CartItem) => {
                const { data: product } = await supabase.from("products").select("*").eq("id", item.product_id).single()

                return { ...item, product }
              }),
            )

            setCartItems(itemsWithProducts)
          } catch (error) {
            console.error("Error parsing local cart:", error)
            setCartItems([])
          }
        } else {
          setCartItems([])
        }
        setIsLoading(false)
        return
      }

      // Load from Supabase for authenticated users
      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select(`
            *,
            product:products(*)
          `)
          .eq("user_id", user.id)

        if (error) throw error
        setCartItems(data || [])
      } catch (error) {
        console.error("Error loading cart:", error)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [user])

  // Add to cart
  const addToCart = async (productId: number, quantity: number) => {
    try {
      // First, check if the product exists and is in stock
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()

      if (productError || !product) {
        toast({
          title: "Hata",
          description: "Ürün bulunamadı.",
          variant: "destructive",
        })
        return
      }

      if (product.stock < quantity) {
        toast({
          title: "Stok Yetersiz",
          description: `Üzgünüz, bu üründen sadece ${product.stock} adet stokta kalmıştır.`,
          variant: "destructive",
        })
        return
      }

      if (!user) {
        // Handle non-authenticated users
        const existingItemIndex = cartItems.findIndex((item) => item.product_id === productId)

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...cartItems]
          updatedItems[existingItemIndex].quantity += quantity
          setCartItems(updatedItems)
          localStorage.setItem("cart", JSON.stringify(updatedItems))
        } else {
          // Add new item
          const newItem = {
            id: Date.now(), // Temporary ID for local storage
            product_id: productId,
            quantity,
            product,
          }

          const updatedItems = [...cartItems, newItem]
          setCartItems(updatedItems)
          localStorage.setItem("cart", JSON.stringify(updatedItems))
        }

        toast({
          title: "Sepete Eklendi",
          description: `${product.name} sepetinize eklendi.`,
        })
        return
      }

      // Handle authenticated users
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle()

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + quantity })
          .eq("id", existingItem.id)
          .select(`
            *,
            product:products(*)
          `)
          .single()

        if (error) throw error

        // Update cart items
        setCartItems((prev) => prev.map((item) => (item.id === existingItem.id ? data : item)))
      } else {
        // Add new item
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          })
          .select(`
            *,
            product:products(*)
          `)
          .single()

        if (error) throw error

        // Add to cart items
        setCartItems((prev) => [...prev, data])
      }

      toast({
        title: "Sepete Eklendi",
        description: `${product.name} sepetinize eklendi.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Hata",
        description: "Ürün sepete eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Remove from cart
  const removeFromCart = async (cartItemId: number) => {
    try {
      if (!user) {
        // Handle non-authenticated users
        const updatedItems = cartItems.filter((item) => item.id !== cartItemId)
        setCartItems(updatedItems)
        localStorage.setItem("cart", JSON.stringify(updatedItems))

        toast({
          title: "Ürün Kaldırıldı",
          description: "Ürün sepetinizden kaldırıldı.",
        })
        return
      }

      // Handle authenticated users
      const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId).eq("user_id", user.id)

      if (error) throw error

      // Update cart items
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId))

      toast({
        title: "Ürün Kaldırıldı",
        description: "Ürün sepetinizden kaldırıldı.",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Hata",
        description: "Ürün sepetten kaldırılırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Update quantity
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return

    try {
      const cartItem = cartItems.find((item) => item.id === cartItemId)
      if (!cartItem) return

      // Check stock
      if (cartItem.product && cartItem.product.stock < quantity) {
        toast({
          title: "Stok Yetersiz",
          description: `Üzgünüz, bu üründen sadece ${cartItem.product.stock} adet stokta kalmıştır.`,
          variant: "destructive",
        })
        return
      }

      if (!user) {
        // Handle non-authenticated users
        const updatedItems = cartItems.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
        setCartItems(updatedItems)
        localStorage.setItem("cart", JSON.stringify(updatedItems))
        return
      }

      // Handle authenticated users
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId)
        .eq("user_id", user.id)
        .select(`
          *,
          product:products(*)
        `)
        .single()

      if (error) throw error

      // Update cart items
      setCartItems((prev) => prev.map((item) => (item.id === cartItemId ? data : item)))
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Hata",
        description: "Sepet güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Clear cart
  const clearCart = async () => {
    try {
      if (!user) {
        // Handle non-authenticated users
        setCartItems([])
        localStorage.removeItem("cart")
        return
      }

      // Handle authenticated users
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) throw error

      // Clear cart items
      setCartItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Hata",
        description: "Sepet temizlenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  const shipping = subtotal > 5000 ? 0 : 150
  const total = subtotal + shipping

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
