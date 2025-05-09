import prisma from "./prisma"
import type { Order } from "@prisma/client"

// Helper function to process product data
function processProduct(product: any): any {
  // Parse JSON fields
  const imageUrls = product.image_urls ? JSON.parse(product.image_urls) : []

  return {
    ...product,
    images: imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"],
  }
}

// Get orders for a specific user
export async function getUserOrders(userId: string): Promise<any[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return orders
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

// Get a specific order by ID
export async function getOrderById(orderId: number): Promise<any | null> {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }

    // Process products in order items
    const orderWithProcessedItems = {
      ...order,
      items: order.order_items.map((item) => ({
        ...item,
        product: item.product ? processProduct(item.product) : null,
      })),
    }

    return orderWithProcessedItems
  } catch (error) {
    console.error(`Error fetching order (ID: ${orderId}):`, error)
    return null
  }
}

// Get order by tracking number
export async function getOrderByTrackingNumber(trackingNumber: string): Promise<any | null> {
  try {
    const cleanTrackingNumber = trackingNumber.trim()

    const order = await prisma.order.findFirst({
      where: {
        tracking_number: cleanTrackingNumber,
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      // If no exact match, try a case-insensitive match
      console.log("No exact match found, trying case-insensitive search...")

      // If still no match, try a direct ID lookup if the tracking number looks like a number
      if (/^\d+$/.test(cleanTrackingNumber)) {
        console.log("Tracking number is numeric, trying as ID...")
        const orderId = Number.parseInt(cleanTrackingNumber, 10)
        return await getOrderById(orderId)
      }

      return null
    }

    // Process products in order items
    const orderWithProcessedItems = {
      ...order,
      items: order.order_items.map((item) => ({
        ...item,
        product: item.product ? processProduct(item.product) : null,
      })),
    }

    return orderWithProcessedItems
  } catch (error) {
    console.error(`Error fetching order (Tracking No: ${trackingNumber}):`, error)
    return null
  }
}

// Get a specific order by ID for a specific user
export async function getUserOrderById(userId: string, orderId: number): Promise<any | null> {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }

    // Process products in order items
    const orderWithProcessedItems = {
      ...order,
      items: order.order_items.map((item) => ({
        ...item,
        product: item.product ? processProduct(item.product) : null,
      })),
    }

    return orderWithProcessedItems
  } catch (error) {
    console.error(`Error fetching user order (ID: ${orderId}, User ID: ${userId}):`, error)
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
    console.log("createOrder called:", { userId, cartItems, shippingAddress, phone, guestEmail })

    // Calculate total amount
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 5000 ? 0 : 150 // Free shipping for orders over 5000 TL
    const total = subtotal + shipping

    // Generate a tracking number
    const trackingNumber = generateTrackingNumber()
    console.log("Generated tracking number:", trackingNumber)

    // Create order
    const order = await prisma.order.create({
      data: {
        user_id: userId,
        guest_email: guestEmail,
        status: "pending",
        total_amount: total,
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_postal_code: shippingAddress.postal_code,
        shipping_country: shippingAddress.country || "Türkiye",
        contact_phone: phone,
        payment_method: "bank_transfer",
        payment_status: "pending",
        tracking_number: trackingNumber,
        order_items: {
          create: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Update product stock
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
      })

      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity)
        await prisma.product.update({
          where: { id: item.product_id },
          data: { stock: newStock },
        })
      }
    }

    return order
  } catch (error: any) {
    console.error("Error creating order:", error)
    throw new Error(error.message || "Error creating order")
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
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updated_at: new Date(),
      },
    })

    return updatedOrder
  } catch (error) {
    console.error(`Error updating order status (ID: ${orderId}):`, error)
    return null
  }
}

// Get all order numbers (for search functionality)
export async function getAllOrderNumbers(): Promise<number[]> {
  try {
    const orders = await prisma.order.findMany({
      select: { id: true },
    })

    return orders.map((order) => order.id)
  } catch (error) {
    console.error("Error fetching order numbers:", error)
    return []
  }
}
