import { supabase } from "@/lib/supabase-client"
import type { Address } from "@/lib/address-service"
import type { CartItem } from "@/contexts/cart-context"

export type Order = {
  id: number
  user_id: string | null
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

export async function createOrder(
  userId: string | null,
  cartItems: CartItem[],
  shippingAddress: Address,
  contactPhone: string,
  guestEmail?: string,
): Promise<Order> {
  try {
    // Use the API endpoint to create the order
    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        cartItems,
        shippingAddress,
        contactPhone,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create order")
    }

    const data = await response.json()
    return data.order as Order
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
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

// New function to get all order numbers from the database
export async function getAllOrderNumbers(): Promise<number[]> {
  try {
    const { data, error } = await supabase.from("orders").select("id").order("created_at", { ascending: false })

    if (error) throw error

    // Extract just the order IDs from the result
    return data.map((order) => order.id) || []
  } catch (error) {
    console.error("Error fetching order numbers:", error)
    return []
  }
}

// New function to get order by ID and phone number
export async function getOrderByIdAndPhone(orderId: number, phone: string): Promise<Order | null> {
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
      .eq("contact_phone", phone)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}
