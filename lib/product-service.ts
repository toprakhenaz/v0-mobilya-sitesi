import { supabase } from "./supabase-client"
import type { Product } from "./supabase"

// Product images mapping
const productImages: Record<string, string[]> = {
  "rattan-bahce-oturma-grubu": ["/products/rattan-bahce-oturma-grubu.jpg", "/products/luxury-sofa-set.png"],
  "modern-bahce-kose-takimi": ["/products/modern-bahce-kose-takimi.jpg", "/products/luxury-garden-corner-set.png"],
  "ahsap-masa-takimi": ["/products/ahsap-masa-takimi.jpg", "/products/wooden-table-set.png"],
  "katlanabilir-sezlong": ["/products/katlanabilir-sezlong.jpg", "/products/garden-lounge.png"],
  "luks-bahce-kose-takimi": ["/products/luks-bahce-kose-takimi.jpg", "/products/luxury-garden-furniture.png"],
  "rattan-salincak": ["/products/rattan-salincak.jpg", "/products/rattan-swing.png"],
  "bahce-semsiyesi": ["/products/bahce-semsiyesi.jpg", "/products/garden-umbrella.png"],
  "aluminyum-bahce-sandalyesi": ["/products/aluminyum-bahce-sandalyesi.jpg", "/products/designer-chair.png"],
  "bistro-masa-takimi": ["/bistro-masa-takimi-1.png", "/bistro-masa-takimi-2.png", "/bistro-masa-takimi-3.png"],
  "eva-masa-takimi": ["/eva-masa-takimi.png", "/eva-masa-takimi-2.png"],
  "pisa-bistro-rattan": ["/pisa-bistro-rattan.png", "/products/modern-dining-table.png"],
  "space-garden-furniture": ["/space-garden-furniture.png", "/products/outdoor-dining-set.png"],
  "pisa-ikili-rattan": ["/pisa-ikili-rattan.png", "/products/premium-bed.png"],
  "palm-aluminum-rattan": ["/palm-aluminum-rattan.png", "/products/executive-desk.png"],
  "efes-midi-garden-set": ["/efes-midi-garden-set.png", "/products/patio-umbrella.png"],
}

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

    // Add images to products
    const productsWithImages =
      data?.map((product) => {
        const slug = product.slug || ""
        const images = productImages[slug] || [defaultProductImage]
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

    // Add images to product
    const slug = data.slug || ""
    const images = productImages[slug] || [defaultProductImage]
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

    // Add images to product
    const images = productImages[slug] || [defaultProductImage]
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

    // Add images to products
    const productsWithImages =
      data?.map((product) => {
        const slug = product.slug || ""
        const images = productImages[slug] || [defaultProductImage]
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

    // Add images to products
    const productsWithImages =
      data?.map((product) => {
        const slug = product.slug || ""
        const images = productImages[slug] || [defaultProductImage]
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

    // Add images to products
    const productsWithImages =
      data?.map((product) => {
        const slug = product.slug || ""
        const images = productImages[slug] || [defaultProductImage]
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

    return {
      products: (data as Product[]) || [],
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

    // Add images to products
    const productsWithImages =
      data?.map((product) => {
        const slug = product.slug || ""
        const images = productImages[slug] || [defaultProductImage]
        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching sale products:", error)
    return []
  }
}
