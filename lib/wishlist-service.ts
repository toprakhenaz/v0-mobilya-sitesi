import prisma from "./prisma"

// Helper function to process product data
function processProduct(product: any): any {
  // Parse JSON fields
  const imageUrls = product.image_urls ? JSON.parse(product.image_urls) : []

  return {
    ...product,
    images: imageUrls.length > 0 ? imageUrls : ["/placeholder.svg"],
  }
}

export async function addToWishlist(userId: string, productId: number) {
  try {
    // Check if already exists
    const existing = await prisma.wishlistItem.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
      },
    })

    if (existing) {
      return true
    }

    await prisma.wishlistItem.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    })

    return true
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    throw error
  }
}

export async function removeFromWishlist(userId: string, productId: number) {
  try {
    await prisma.wishlistItem.deleteMany({
      where: {
        user_id: userId,
        product_id: productId,
      },
    })

    return true
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    throw error
  }
}

export async function isInWishlist(userId: string, productId: number) {
  try {
    const item = await prisma.wishlistItem.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
      },
    })

    return !!item
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}

export async function getWishlistItems(userId: string) {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: {
        user_id: userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return items.map((item) => processProduct(item.product))
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    return []
  }
}
