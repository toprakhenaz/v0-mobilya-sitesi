import { supabase } from "@/lib/supabase-client"
import type { Address } from "@/lib/address-service"
import type { CartItem } from "@/contexts/cart-context"

export type Order = {
  id: number
  user_id: string | null
  // Remove guest_email field
  guest_phone?: string
  total_amount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  payment_method: "bank_transfer"
  payment_status: "pending" | "completed"
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  contact_phone: string
  tracking_number?: string
  created_at: string
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: any
}

// Modify the createOrder function to remove guest_email field
export async function createOrder(
  userId: string | null,
  cartItems: CartItem[],
  shippingAddress: Address,
  contactPhone: string,
  guestEmail?: string,
): Promise<Order> {
  // Calculate total amount
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)

  // Calculate shipping
  const shipping = subtotal > 5000 ? 0 : 150
  const finalTotal = subtotal + shipping

  try {
    // Create order - remove guest_email field
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        // Remove guest_email field as it doesn't exist in the schema
        guest_phone: !userId ? contactPhone : undefined,
        total_amount: finalTotal,
        status: "pending",
        payment_method: "bank_transfer",
        payment_status: "pending",
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_postal_code: shippingAddress.postal_code,
        shipping_country: shippingAddress.country,
        contact_phone: contactPhone,
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    const order = orderData as Order

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw itemsError
    }

    // Update product stock
    for (const item of cartItems) {
      if (item.product) {
        const newStock = item.product.stock - item.quantity
        await supabase.from("products").update({ stock: newStock }).eq("id", item.product_id)
      }
    }

    return order
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function getOrderById(orderId: number, userId?: string): Promise<Order | null> {
  try {
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq("id", orderId)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function getOrderByTrackingCode(orderId: number, email: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq("id", orderId)
      // Remove the guest_email check since it doesn't exist
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}
