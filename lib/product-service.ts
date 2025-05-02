import { supabase } from "./supabase-client"
import type { Product } from "./supabase"

// Default image for products without specific images
const defaultProductImage = "/diverse-products-still-life.png"

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
    let query = supabase.from("products").select("*", { count: "exact" })

    // Apply category filter
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    // Apply price filters
    if (filters?.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice)
    }
    if (filters?.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice)
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true })
          break
        case "price_desc":
          query = query.order("price", { ascending: false })
          break
        case "newest":
          query = query.order("created_at", { ascending: false })
          break
        case "popular":
          query = query.order("sales_count", { ascending: false })
          break
      }
    } else {
      // Default sorting
      query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return {
      products: productsWithImages,
      total: count || 0,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], total: 0 }
  }
}

// Get a single product by ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    // Use image_urls from database if available
    const images = data.image_urls && data.image_urls.length > 0 ? data.image_urls : [defaultProductImage]

    return { ...data, images }
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

// Get a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    // Use image_urls from database if available
    const images = data.image_urls && data.image_urls.length > 0 ? data.image_urls : [defaultProductImage]

    return { ...data, images }
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
}

export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      throw error
    }

    return data as any[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    // Fix: Use .limit(1) and then access the first item instead of .single()
    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).limit(1)

    if (error) {
      throw error
    }

    // Return the first item if it exists, otherwise null
    return data && data.length > 0 ? (data[0] as any) : null
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

// Get featured products
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    // Instead of using is_featured column which doesn't exist,
    // we'll use the newest products as featured
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return [] // Return empty array instead of throwing error
  }
}

// Get promotional products
export async function getPromotionalProducts(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .not("discount_percentage", "is", null)
      .gt("discount_percentage", 0)
      .order("discount_percentage", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching promotional products:", error)
    throw error
  }
}

// Get related products
export async function getRelatedProducts(productId: number, categoryId: number, limit = 4): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", productId)
      .limit(limit)

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching related products:", error)
    throw error
  }
}

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
    // Start with the search query
    let dbQuery = supabase
      .from("products")
      .select("*", { count: "exact" })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Apply price filters
    if (filters?.minPrice !== undefined) {
      dbQuery = dbQuery.gte("price", filters.minPrice)
    }
    if (filters?.maxPrice !== undefined) {
      dbQuery = dbQuery.lte("price", filters.maxPrice)
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          dbQuery = dbQuery.order("price", { ascending: true })
          break
        case "price_desc":
          dbQuery = dbQuery.order("price", { ascending: false })
          break
        case "newest":
          dbQuery = dbQuery.order("created_at", { ascending: false })
          break
        case "popular":
          dbQuery = dbQuery.order("sales_count", { ascending: false })
          break
      }
    } else {
      // Default sorting
      dbQuery = dbQuery.order("created_at", { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    dbQuery = dbQuery.range(from, to)

    const { data, count, error } = await dbQuery

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return {
      products: productsWithImages,
      total: count || 0,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    return { products: [], total: 0 }
  }
}

// Get sale products
export async function getSaleProducts(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .not("discount_percentage", "is", null)
      .gt("discount_percentage", 0)
      .order("discount_percentage", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching sale products:", error)
    return []
  }
}

// Get new products
export async function getNewProducts(limit = 24): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching new products:", error)
    return []
  }
}

// Update product images
export async function updateProductImages(productId: number, imageUrls: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from("products").update({ image_urls: imageUrls }).eq("id", productId)

    if (error) {
      throw error
    }

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
    const { data: products, error } = await supabase.from("products").select("id, slug")

    if (error) {
      throw error
    }

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
      await supabase.from("products").update({ image_urls: matchedImages }).eq("id", product.id)
    }

    return true
  } catch (error) {
    console.error("Error updating all product images:", error)
    return false
  }
}
