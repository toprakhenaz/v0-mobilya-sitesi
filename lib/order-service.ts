import { supabase } from "./supabase-client"

export interface Order {
  id: number
  user_id: string | null
  guest_email?: string | null
  status: string
  total_amount: number
  shipping_address: string
  billing_address: string
  payment_method: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: {
    name: string
    slug: string
  }
}

// Get orders for a specific user
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Siparişler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return []
  }
}

// Get a specific order by ID
export async function getOrderById(orderId: number): Promise<Order | null> {
  try {
    // Get the order
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      console.error(`Sipariş (ID: ${orderId}) alınırken hata:`, error.message)
      return null
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(name, slug)")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error(`Sipariş ürünleri (Sipariş ID: ${orderId}) alınırken hata:`, itemsError.message)
    }

    return {
      ...data,
      items: items || [],
    }
  } catch (error) {
    console.error(`Sipariş (ID: ${orderId}) alınırken hata:`, error)
    return null
  }
}

// Get a specific order by ID for a specific user
export async function getUserOrderById(userId: string, orderId: number): Promise<Order | null> {
  try {
    // Get the order
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).eq("user_id", userId).single()

    if (error) {
      console.error(`Sipariş (ID: ${orderId}, Kullanıcı ID: ${userId}) alınırken hata:`, error.message)
      return null
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(name, slug)")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error(
        `Sipariş ürünleri (Sipariş ID: ${orderId}, Kullanıcı ID: ${userId}) alınırken hata:`,
        itemsError.message,
      )
    }

    return {
      ...data,
      items: items || [],
    }
  } catch (error) {
    console.error(`Sipariş (ID: ${orderId}, Kullanıcı ID: ${userId}) alınırken hata:`, error)
    return null
  }
}

// Create a new order
export async function createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Sipariş oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error)
    return null
  }
}

// Update order status
export async function updateOrderStatus(orderId: number, status: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error(`Sipariş durumu (ID: ${orderId}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error(`Sipariş durumu (ID: ${orderId}) güncellenirken hata:`, error)
    return null
  }
}

// Get all order numbers (for search functionality)
export async function getAllOrderNumbers(): Promise<number[]> {
  try {
    const { data, error } = await supabase.from("orders").select("id")

    if (error) {
      console.error("Sipariş numaraları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return (data || []).map((order) => order.id)
  } catch (error) {
    console.error("Sipariş numaraları alınırken hata:", error)
    return []
  }
}
