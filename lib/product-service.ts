import prisma from "./prisma"

// Default image for products without specific images
const defaultProductImage = "/diverse-products-still-life.png"

// Helper function to parse JSON fields
function parseJsonField(field: string | null) {
  if (!field) return null
  try {
    return JSON.parse(field)
  } catch (error) {
    console.error("Error parsing JSON field:", error)
    return null
  }
}

// Helper function to process product data
function processProduct(product: any): any {
  // Parse JSON fields
  const imageUrls = parseJsonField(product.image_urls) || []
  const features = parseJsonField(product.features) || []
  const specifications = parseJsonField(product.specifications) || {}

  // Ensure product has images
  const images = imageUrls.length > 0 ? imageUrls : [defaultProductImage]

  return {
    ...product,
    images,
    features,
    specifications,
  }
}

// Get all products with optional filtering
export async function getProducts(
  categoryId?: number,
  filters?: {
    minPrice?: number
    maxPrice?: number
    sortBy?: "price_asc" | "price_desc" | "newest" | "popular"
  },
  page = 1,
  limit = 12,
) {
  try {
    // Build where clause
    const where: any = {}

    if (categoryId) {
      where.category_id = categoryId
    }

    if (filters?.minPrice !== undefined) {
      where.price = {
        ...(where.price || {}),
        gte: filters.minPrice,
      }
    }

    if (filters?.maxPrice !== undefined) {
      where.price = {
        ...(where.price || {}),
        lte: filters.maxPrice,
      }
    }

    // Build orderBy
    let orderBy: any = { created_at: "desc" }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          orderBy = { price: "asc" }
          break
        case "price_desc":
          orderBy = { price: "desc" }
          break
        case "newest":
          orderBy = { created_at: "desc" }
          break
        case "popular":
          orderBy = { id: "desc" }
          break
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count
    const totalCount = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: true,
      },
    })

    // Process products
    const processedProducts = products.map(processProduct)

    return {
      products: processedProducts,
      total: totalCount,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], total: 0 }
  }
}

// Get a single product by ID
export async function getProductById(id: number): Promise<any | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!product) {
      return null
    }

    return processProduct(product)
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

// Get a single product by slug
export async function getProductBySlug(slug: string): Promise<any | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    })

    if (!product) {
      return null
    }

    return processProduct(product)
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
}

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    // Add default image URLs if missing
    return categories.map((category) => {
      if (!category.image_url) {
        return {
          ...category,
          image_url: `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(
            (category.name || "furniture") + " furniture",
          )}`,
        }
      }
      return category
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get a category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    })

    return category
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

// Get featured products
export async function getFeaturedProducts(limit = 8): Promise<any[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    })

    return products.map(processProduct)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

// Get promotional products
export async function getPromotionalProducts(limit = 8): Promise<any[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        discount_percentage: {
          gt: 0,
        },
      },
      orderBy: {
        discount_percentage: "desc",
      },
      take: limit,
    })

    return products.map(processProduct)
  } catch (error) {
    console.error("Error fetching promotional products:", error)
    return []
  }
}

// Get related products
export async function getRelatedProducts(productId: number, categoryId: number, limit = 4): Promise<any[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category_id: categoryId,
        id: {
          not: productId,
        },
      },
      take: limit,
    })

    return products.map(processProduct)
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

// Search products
export async function searchProducts(
  query: string,
  filters?: {
    minPrice?: number
    maxPrice?: number
    sortBy?: "price_asc" | "price_desc" | "newest" | "popular"
  },
  page = 1,
  limit = 24,
) {
  try {
    // Build where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }

    if (filters?.minPrice !== undefined) {
      where.price = {
        ...(where.price || {}),
        gte: filters.minPrice,
      }
    }

    if (filters?.maxPrice !== undefined) {
      where.price = {
        ...(where.price || {}),
        lte: filters.maxPrice,
      }
    }

    // Build orderBy
    let orderBy: any = { created_at: "desc" }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          orderBy = { price: "asc" }
          break
        case "price_desc":
          orderBy = { price: "desc" }
          break
        case "newest":
          orderBy = { created_at: "desc" }
          break
        case "popular":
          orderBy = { id: "desc" }
          break
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count
    const totalCount = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    })

    // Process products
    const processedProducts = products.map(processProduct)

    return {
      products: processedProducts,
      total: totalCount,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return { products: [], total: 0 }
  }
}

// Get sale products
export async function getSaleProducts(limit = 8): Promise<any[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        discount_percentage: {
          gt: 0,
        },
      },
      orderBy: {
        discount_percentage: "desc",
      },
      take: limit,
    })

    return products.map(processProduct)
  } catch (error) {
    console.error("Error fetching sale products:", error)
    return []
  }
}

// Get new products
export async function getNewProducts(limit = 24): Promise<any[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        is_new: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    })

    return products.map(processProduct)
  } catch (error) {
    console.error("Error fetching new products:", error)
    return []
  }
}

// Update product images
export async function updateProductImages(productId: number, imageUrls: string[]): Promise<boolean> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        image_urls: JSON.stringify(imageUrls),
      },
    })

    return true
  } catch (error) {
    console.error("Error updating product images:", error)
    return false
  }
}

// Update all product images based on slug patterns
export async function updateAllProductImages(): Promise<boolean> {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
      },
    })

    // Product image mapping based on slug patterns
    const imagePatterns = [
      { pattern: "rattan", images: ["/products/rattan-bahce-oturma-grubu.jpg", "/rattan-garden-furniture.png"] },
      { pattern: "masa-takimi", images: ["/products/ahsap-masa-takimi.jpg", "/wooden-table-set.png"] },
      { pattern: "kose-takimi", images: ["/products/luks-bahce-kose-takimi.jpg", "/luxury-garden-corner-set.png"] },
      { pattern: "salincak", images: ["/products/rattan-salincak.jpg", "/rattan-swing.png"] },
      { pattern: "semsiye", images: ["/products/bahce-semsiyesi.jpg", "/garden-umbrella.png"] },
      { pattern: "sandalye", images: ["/products/aluminyum-bahce-sandalyesi.jpg"] },
      {
        pattern: "bistro",
        images: ["/bistro-masa-takimi-1.png", "/bistro-masa-takimi-2.png", "/bistro-masa-takimi-3.png"],
      },
      { pattern: "eva", images: ["/eva-masa-takimi.png", "/eva-masa-takimi-2.png"] },
      { pattern: "pisa", images: ["/pisa-bistro-rattan.png", "/pisa-ikili-rattan.png"] },
      { pattern: "garden", images: ["/space-garden-furniture.png", "/outdoor-garden-furniture-set.png"] },
      { pattern: "aluminum", images: ["/palm-aluminum-rattan.png"] },
      { pattern: "efes", images: ["/efes-midi-garden-set.png"] },
      { pattern: "sofa", images: ["/products/luxury-sofa-set.png"] },
      { pattern: "dining", images: ["/products/modern-dining-table.png", "/products/outdoor-dining-set.png"] },
      { pattern: "desk", images: ["/products/executive-desk.png"] },
      { pattern: "bed", images: ["/products/premium-bed.png"] },
      { pattern: "chair", images: ["/products/designer-chair.png"] },
      { pattern: "patio", images: ["/products/patio-umbrella.png"] },
      { pattern: "lounge", images: ["/products/garden-lounge.png"] },
      // Default images for products that don't match any pattern
      { pattern: "", images: ["/diverse-products-still-life.png", "/abstract-geometric-shapes.png"] },
    ]

    // Update each product
    for (const product of products || []) {
      // Find matching image pattern
      let matchedImages = ["/diverse-products-still-life.png"] // Default image

      for (const pattern of imagePatterns) {
        if (pattern.pattern && product.slug.includes(pattern.pattern)) {
          matchedImages = pattern.images
          break
        }
      }

      // Update product with matched images
      await prisma.product.update({
        where: { id: product.id },
        data: {
          image_urls: JSON.stringify(matchedImages),
        },
      })
    }

    return true
  } catch (error) {
    console.error("Error updating all product images:", error)
    return false
  }
}
