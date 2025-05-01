import { supabase } from "./supabase-client"
import type { Product, Category } from "./supabase"

export async function getProducts(
  categorySlug?: string,
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

    // Apply category filter if provided
    if (categorySlug) {
      // First get the category ID
      const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", categorySlug).limit(1)

      if (categoryData && categoryData.length > 0) {
        query = query.eq("category_id", categoryData[0].id)
      }
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

    const { data: products, count, error } = await query

    if (error) {
      throw error
    }

    return {
      products: (products as Product[]) || [],
      total: count || 0,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], total: 0 }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error) {
      throw error
    }

    return data as Product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getCategories() {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      throw error
    }

    return data as Category[]
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
    return data && data.length > 0 ? (data[0] as Category) : null
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

export async function getFeaturedProducts(limit = 8) {
  try {
    // Instead of using is_featured column, we'll use the newest products as featured
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return data as Product[]
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getSaleProducts(limit = 8) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("discount_percentage", 0)
      .order("discount_percentage", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return data as Product[]
  } catch (error) {
    console.error("Error fetching discounted products:", error)
    return []
  }
}

export async function getRelatedProducts(categoryId: number, currentProductId: number, limit = 4) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", currentProductId)
      .limit(limit)

    if (error) {
      throw error
    }

    return data as Product[]
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
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
