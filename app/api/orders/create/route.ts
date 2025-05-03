import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(request: Request) {
  try {
    const { userId, cartItems, shippingAddress, contactPhone, guestEmail } = await request.json()

    // Validate input data
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    // Calculate total amount
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product?.price || 0
      return total + price * item.quantity
    }, 0)

    // Calculate shipping
    const shipping = subtotal > 5000 ? 0 : 150
    const finalTotal = subtotal + shipping

    // Generate tracking number
    const trackingNumber = generateTrackingNumber()

    // Create order data object
    const orderData = {
      user_id: userId || null,
      total_amount: finalTotal,
      status: "pending",
      payment_method: "bank_transfer",
      payment_status: "pending",
      shipping_address: shippingAddress.address || "",
      shipping_city: shippingAddress.city || "",
      shipping_postal_code: shippingAddress.postal_code || "",
      shipping_country: shippingAddress.country || "Türkiye",
      contact_phone: contactPhone || "",
      guest_email: !userId && guestEmail ? guestEmail : null,
      tracking_number: trackingNumber,
    }

    // Create order using admin client
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    if (!order || !order.id) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items using admin client
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
    }))

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    // Update product stock using admin client
    for (const item of cartItems) {
      if (item.product && item.product_id) {
        const newStock = Math.max(0, (item.product.stock || 0) - item.quantity)
        const { error: stockError } = await supabaseAdmin
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product_id)

        if (stockError) {
          console.error("Stock update error:", stockError)
        }
      }
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Error in order creation API:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}

// Generate a tracking number
function generateTrackingNumber(): string {
  const prefix = "TR"
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
  const timestamp = Date.now().toString().slice(-4)
  return `${prefix}${randomPart}${timestamp}`
}
