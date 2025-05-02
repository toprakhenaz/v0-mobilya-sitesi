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

    // Calculate total amount
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product?.price || 0
      return total + price * item.quantity
    }, 0)

    // Calculate shipping
    const shipping = subtotal > 5000 ? 0 : 150
    const finalTotal = subtotal + shipping

    // Create order data object
    const orderData = {
      user_id: userId,
      total_amount: finalTotal,
      status: "pending",
      payment_method: "bank_transfer",
      payment_status: "pending",
      shipping_address: shippingAddress.address,
      shipping_city: shippingAddress.city,
      shipping_postal_code: shippingAddress.postal_code,
      shipping_country: shippingAddress.country,
      contact_phone: contactPhone,
      guest_email: !userId && guestEmail ? guestEmail : null,
    }

    // Create order using admin client
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
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
      if (item.product) {
        const newStock = Math.max(0, item.product.stock - item.quantity)
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
  } catch (error) {
    console.error("Error in order creation API:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
