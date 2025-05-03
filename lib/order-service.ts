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
  tracking_number?: string | null
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
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId)

    if (error) {
      console.error(`Sipariş (ID: ${orderId}) alınırken hata:`, error.message)
      return null
    }

    // If no order found, return null
    if (!data || data.length === 0) {
      return null
    }

    const order = data[0]

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(name, slug)")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error(`Sipariş ürünleri (Sipariş ID: ${orderId}) alınırken hata:`, itemsError.message)
    }

    return {
      ...order,
      items: items || [],
    }
  } catch (error) {
    console.error(`Sipariş (ID: ${orderId}) alınırken hata:`, error)
    return null
  }
}

// Get order by tracking number - FIXED VERSION
export async function getOrderByTrackingNumber(trackingNumber: string): Promise<Order | null> {
  try {
    // Trim the tracking number to remove any whitespace
    const cleanTrackingNumber = trackingNumber.trim()

    console.log(`Takip numarası ile arama: "${cleanTrackingNumber}"`)

    // Debug: List all tracking numbers to see what's available
    const { data: allOrders, error: listError } = await supabase
      .from("orders")
      .select("id, tracking_number")
      .order("id", { ascending: true })

    if (listError) {
      console.error("Takip numaraları listelenirken hata:", listError.message)
    } else {
      console.log("Mevcut takip numaraları:", JSON.stringify(allOrders))
    }

    // Direct query with exact match
    const { data, error } = await supabase.from("orders").select("*").eq("tracking_number", cleanTrackingNumber)

    if (error) {
      console.error(`Sipariş (Takip No: ${cleanTrackingNumber}) alınırken hata:`, error.message)
      return null
    }

    // If no exact match, try case-insensitive match
    if (!data || data.length === 0) {
      console.log("Tam eşleşme bulunamadı, büyük/küçük harf duyarsız arama yapılıyor...")

      // Try a raw SQL query as a last resort
      const { data: rawData, error: rawError } = await supabase.rpc("find_order_by_tracking", {
        p_tracking_number: cleanTrackingNumber,
      })

      if (rawError) {
        console.error("RPC çağrısı sırasında hata:", rawError.message)
      } else if (rawData && rawData.length > 0) {
        console.log("RPC ile sipariş bulundu:", rawData)

        // Get order items
        const orderId = rawData[0].id
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*, product:products(name, slug)")
          .eq("order_id", orderId)

        if (itemsError) {
          console.error(`Sipariş ürünleri (Sipariş ID: ${orderId}) alınırken hata:`, itemsError.message)
        }

        return {
          ...rawData[0],
          items: items || [],
        }
      }

      // If still no match, try a direct ID lookup if the tracking number looks like a number
      if (/^\d+$/.test(cleanTrackingNumber)) {
        console.log("Takip numarası sayısal, ID olarak deneniyor...")
        const orderId = Number.parseInt(cleanTrackingNumber, 10)
        return await getOrderById(orderId)
      }

      console.log("Sipariş bulunamadı")
      return null
    }

    console.log(`Sipariş bulundu: ID=${data[0].id}, Takip No=${data[0].tracking_number}`)
    const order = data[0]

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(name, slug)")
      .eq("order_id", order.id)

    if (itemsError) {
      console.error(`Sipariş ürünleri (Sipariş ID: ${order.id}) alınırken hata:`, itemsError.message)
    }

    return {
      ...order,
      items: items || [],
    }
  } catch (error) {
    console.error(`Sipariş (Takip No: ${trackingNumber}) alınırken hata:`, error)
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
export async function createOrder(
  userId: string | null,
  cartItems: any[],
  shippingAddress: any,
  phone: string,
  guestEmail?: string,
): Promise<Order> {
  try {
    console.log("createOrder çağrıldı:", { userId, cartItems, shippingAddress, phone, guestEmail })

    // Calculate total amount
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 5000 ? 0 : 150 // Free shipping for orders over 5000 TL
    const total = subtotal + shipping

    // Generate a tracking number
    const trackingNumber = generateTrackingNumber()
    console.log("Oluşturulan takip numarası:", trackingNumber)

    // Format address as string
    const addressStr = `${shippingAddress.full_name}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postal_code}, ${shippingAddress.country}, ${phone}`

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          guest_email: guestEmail,
          status: "pending",
          total_amount: total,
          shipping_address: addressStr,
          billing_address: addressStr, // Same as shipping address
          payment_method: "bank_transfer",
          tracking_number: trackingNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (orderError) {
      console.error("Sipariş oluşturulurken hata:", orderError.message)
      throw new Error(orderError.message)
    }

    if (!orderData || orderData.length === 0) {
      throw new Error("Sipariş oluşturuldu ancak veri döndürülemedi")
    }

    const order = orderData[0]
    console.log("Oluşturulan sipariş:", order)

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Sipariş öğeleri oluşturulurken hata:", itemsError.message)
      throw new Error(itemsError.message)
    }

    return order
  } catch (error: any) {
    console.error("Sipariş oluşturulurken hata:", error)
    throw new Error(error.message || "Sipariş oluşturulurken bir hata oluştu")
  }
}

// Generate a tracking number
export function generateTrackingNumber(): string {
  const prefix = "TR"
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
  const timestamp = Date.now().toString().slice(-4)
  return `${prefix}${randomPart}${timestamp}`
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
