import { createClient } from "@supabase/supabase-js"

// Client-side singleton pattern
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and key must be provided")
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseInstance
}

// Site Settings Types
export interface SiteSetting {
  id: number
  key: string
  value: string
  description: string
  created_at: string
  updated_at: string
}

// Admin User Types
export interface AdminUser {
  id: number
  email: string
  full_name: string | null
  is_super_admin: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

// Category Types
export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  product_count?: number
}

// Product Types
export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  discount_price: number | null
  stock: number
  category_id: number
  category?: {
    name: string
  }
  created_at: string
  updated_at: string
  images?: ProductImage[]
}

export interface ProductImage {
  id: number
  product_id: number
  url: string
  is_primary: boolean
  created_at: string
}

// Order Types
export interface Order {
  id: number
  user_id: string
  status: string
  total_amount: number
  shipping_address: string
  billing_address: string
  payment_method: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
  user_email?: string
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

// User Types
export interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
  orders_count?: number
}

// Hero Carousel Types
export interface HeroSlide {
  id: number
  image_url: string
  title: string
  subtitle: string
  description: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Get all site settings
export async function getSiteSettings(): Promise<SiteSetting[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("site_settings").select("*")

  if (error) {
    console.error("Site ayarları alınırken hata:", error.message)
    throw new Error(error.message)
  }

  return data || []
}

// Get a specific site setting by key
export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("site_settings").select("*").eq("key", key).single()

  if (error) {
    console.error(`${key} ayarı alınırken hata:`, error.message)
    return null
  }

  return data
}

// Update a site setting
export async function updateSiteSetting(key: string, value: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("site_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key)

  if (error) {
    console.error(`${key} ayarı güncellenirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Update multiple site settings at once
export async function updateMultipleSettings(settings: { key: string; value: string }[]): Promise<void> {
  const supabase = getSupabaseClient()
  // Use a transaction to update all settings
  const updates = settings.map((setting) => {
    return supabase
      .from("site_settings")
      .update({ value: setting.value, updated_at: new Date().toISOString() })
      .eq("key", setting.key)
  })

  // Execute all updates
  await Promise.all(updates)
}

// Admin authentication
export async function adminLogin(
  email: string,
  password: string,
): Promise<{ user: AdminUser | null; error: string | null }> {
  const supabase = getSupabaseClient()
  // This is a simplified example. In a real application, you would use proper authentication
  const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

  if (error) {
    return { user: null, error: "Kullanıcı bulunamadı" }
  }

  // In a real application, you would verify the password hash here
  // For now, we'll just check if the email exists
  if (data) {
    // Update last login time
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", data.id)

    return { user: data, error: null }
  }

  return { user: null, error: "Geçersiz e-posta veya şifre" }
}

// Get all admin users
export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("admin_users").select("*")

  if (error) {
    console.error("Admin kullanıcıları alınırken hata:", error.message)
    throw new Error(error.message)
  }

  return data || []
}

// Get admin user by ID
export async function getAdminUser(id: number): Promise<AdminUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("admin_users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Admin kullanıcısı (ID: ${id}) alınırken hata:`, error.message)
    return null
  }

  return data
}

// Create a new admin user
export async function createAdminUser(
  user: Omit<AdminUser, "id" | "created_at" | "updated_at">,
): Promise<AdminUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("admin_users")
    .insert([
      {
        ...user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Admin kullanıcısı oluşturulurken hata:", error.message)
    throw new Error(error.message)
  }

  return data?.[0] || null
}

// Update an admin user
export async function updateAdminUser(id: number, user: Partial<AdminUser>): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from("admin_users")
    .update({ ...user, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error(`Admin kullanıcısı (ID: ${id}) güncellenirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Delete an admin user
export async function deleteAdminUser(id: number): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("admin_users").delete().eq("id", id)

  if (error) {
    console.error(`Admin kullanıcısı (ID: ${id}) silinirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Get all categories
export async function getCategories(searchTerm?: string): Promise<Category[]> {
  const supabase = getSupabaseClient()
  let query = supabase.from("categories").select("*").order("name", { ascending: true })

  // Apply search filter if provided
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Kategoriler alınırken hata:", error.message)
    throw new Error(error.message)
  }

  // Get product count for each category
  const categoriesWithProductCount = await Promise.all(
    (data || []).map(async (category) => {
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)

      if (countError) {
        console.error(`Kategori ${category.id} için ürün sayısı alınırken hata:`, countError.message)
      }

      return {
        ...category,
        product_count: count || 0,
      }
    }),
  )

  return categoriesWithProductCount || []
}

// Get a category by ID
export async function getCategory(id: number): Promise<Category | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

  if (error) {
    console.error(`Kategori (ID: ${id}) alınırken hata:`, error.message)
    return null
  }

  return data
}

// Create a new category
export async function createCategory(
  category: Omit<Category, "id" | "created_at" | "updated_at" | "product_count">,
): Promise<Category | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        ...category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Kategori oluşturulurken hata:", error.message)
    throw new Error(error.message)
  }

  return data?.[0] || null
}

// Update a category
export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .update({ ...category, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Kategori (ID: ${id}) güncellenirken hata:`, error.message)
    throw new Error(error.message)
  }

  return data
}

// Delete a category
export async function deleteCategory(id: number): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error(`Kategori (ID: ${id}) silinirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Get all products with pagination
export async function getProducts(
  page = 1,
  itemsPerPage = 10,
  searchTerm?: string,
): Promise<{ products: Product[]; totalCount: number }> {
  const supabase = getSupabaseClient()

  // Calculate range for pagination
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  // Build query for count
  let countQuery = supabase.from("products").select("*", { count: "exact" })

  // Apply search filter if provided
  if (searchTerm) {
    countQuery = countQuery.ilike("name", `%${searchTerm}%`)
  }

  // Get total count
  const { count, error: countError } = await countQuery

  if (countError) {
    console.error("Ürün sayısı alınırken hata:", countError.message)
    throw new Error(countError.message)
  }

  // Build query for products
  let productsQuery = supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false })
    .range(from, to)

  // Apply search filter if provided
  if (searchTerm) {
    productsQuery = productsQuery.ilike("name", `%${searchTerm}%`)
  }

  // Get products
  const { data, error } = await productsQuery

  if (error) {
    console.error("Ürünler alınırken hata:", error.message)
    throw new Error(error.message)
  }

  return {
    products: data || [],
    totalCount: count || 0,
  }
}

// Get a product by ID
export async function getProduct(id: number): Promise<Product | null> {
  const supabase = getSupabaseClient()

  // Get product
  const { data, error } = await supabase.from("products").select("*, category:categories(name)").eq("id", id).single()

  if (error) {
    console.error(`Ürün (ID: ${id}) alınırken hata:`, error.message)
    return null
  }

  // Get product images
  const { data: images, error: imagesError } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("is_primary", { ascending: false })

  if (imagesError) {
    console.error(`Ürün resimleri (Ürün ID: ${id}) alınırken hata:`, imagesError.message)
  }

  return {
    ...data,
    images: images || [],
  }
}

// Create a new product
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at" | "images">,
): Promise<Product | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Ürün oluşturulurken hata:", error.message)
    throw new Error(error.message)
  }

  return data?.[0] || null
}

// Update a product
export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  const supabase = getSupabaseClient()

  // Remove images from product object if present
  const { images, ...productData } = product as any

  const { data, error } = await supabase
    .from("products")
    .update({ ...productData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Ürün (ID: ${id}) güncellenirken hata:`, error.message)
    throw new Error(error.message)
  }

  return data
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  const supabase = getSupabaseClient()

  // First delete product images
  const { error: imagesError } = await supabase.from("product_images").delete().eq("product_id", id)

  if (imagesError) {
    console.error(`Ürün resimleri (Ürün ID: ${id}) silinirken hata:`, imagesError.message)
    throw new Error(imagesError.message)
  }

  // Then delete the product
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Ürün (ID: ${id}) silinirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Add product image
export async function addProductImage(productId: number, url: string, isPrimary = false): Promise<ProductImage | null> {
  const supabase = getSupabaseClient()

  // If this is a primary image, update all other images to not be primary
  if (isPrimary) {
    await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId)
  }

  const { data, error } = await supabase
    .from("product_images")
    .insert([
      {
        product_id: productId,
        url,
        is_primary: isPrimary,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error(`Ürün resmi eklenirken hata:`, error.message)
    throw new Error(error.message)
  }

  return data?.[0] || null
}

// Delete product image
export async function deleteProductImage(id: number): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("product_images").delete().eq("id", id)

  if (error) {
    console.error(`Ürün resmi (ID: ${id}) silinirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Get all orders with pagination
export async function getOrders(
  page = 1,
  itemsPerPage = 10,
  status?: string,
  searchTerm?: string,
): Promise<{ orders: Order[]; totalCount: number }> {
  const supabase = getSupabaseClient()

  // Calculate range for pagination
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  // Build query for count
  let countQuery = supabase.from("orders").select("*", { count: "exact" })

  // Apply status filter if provided
  if (status) {
    countQuery = countQuery.eq("status", status)
  }

  // Apply search filter if provided
  if (searchTerm) {
    countQuery = countQuery.or(`id.eq.${Number.parseInt(searchTerm) || 0},shipping_address.ilike.%${searchTerm}%`)
  }

  // Get total count
  const { count, error: countError } = await countQuery

  if (countError) {
    console.error("Sipariş sayısı alınırken hata:", countError.message)
    throw new Error(countError.message)
  }

  // Build query for orders - Burada ilişkili tabloları sorgulama yöntemini değiştirdik
  let ordersQuery = supabase.from("orders").select("*").order("created_at", { ascending: false }).range(from, to)

  // Apply status filter if provided
  if (status) {
    ordersQuery = ordersQuery.eq("status", status)
  }

  // Apply search filter if provided
  if (searchTerm) {
    ordersQuery = ordersQuery.or(`id.eq.${Number.parseInt(searchTerm) || 0},shipping_address.ilike.%${searchTerm}%`)
  }

  // Get orders
  const { data, error } = await ordersQuery

  if (error) {
    console.error("Siparişler alınırken hata:", error.message)
    throw new Error(error.message)
  }

  // Kullanıcı e-postalarını ayrı bir sorgu ile al
  const orders = await Promise.all(
    (data || []).map(async (order) => {
      if (order.user_id) {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email")
            .eq("id", order.user_id)
            .single()

          if (userError) {
            console.error(`Kullanıcı bilgisi alınırken hata (Kullanıcı ID: ${order.user_id}):`, userError.message)
            return { ...order, user_email: null }
          }

          return { ...order, user_email: userData?.email || null }
        } catch (error) {
          console.error(`Kullanıcı bilgisi alınırken hata (Kullanıcı ID: ${order.user_id}):`, error)
          return { ...order, user_email: null }
        }
      }
      return { ...order, user_email: null }
    }),
  )

  return {
    orders,
    totalCount: count || 0,
  }
}

// Get an order by ID
export async function getOrder(id: number): Promise<Order | null> {
  const supabase = getSupabaseClient()

  // Get order
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single()

  if (error) {
    console.error(`Sipariş (ID: ${id}) alınırken hata:`, error.message)
    return null
  }

  // Get order items
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*, product:products(name, slug)")
    .eq("order_id", id)

  if (itemsError) {
    console.error(`Sipariş ürünleri (Sipariş ID: ${id}) alınırken hata:`, itemsError.message)
  }

  // Get user email if user_id exists
  let user_email = null
  if (data.user_id) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("id", data.user_id)
      .single()

    if (!userError && userData) {
      user_email = userData.email
    }
  }

  return {
    ...data,
    items: items || [],
    user_email,
  }
}

// Update order status
export async function updateOrderStatus(id: number, status: string): Promise<Order | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Sipariş durumu (ID: ${id}) güncellenirken hata:`, error.message)
    throw new Error(error.message)
  }

  return data
}

// Get all users with pagination
export async function getUsers(
  page = 1,
  itemsPerPage = 10,
  searchTerm?: string,
): Promise<{ users: User[]; totalCount: number }> {
  const supabase = getSupabaseClient()

  // Calculate range for pagination
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  // Build query for count
  let countQuery = supabase.from("users").select("*", { count: "exact" })

  // Apply search filter if provided
  if (searchTerm) {
    countQuery = countQuery.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
  }

  // Get total count
  const { count, error: countError } = await countQuery

  if (countError) {
    console.error("Kullanıcı sayısı alınırken hata:", countError.message)
    throw new Error(countError.message)
  }

  // Build query for users
  let usersQuery = supabase.from("users").select("*").order("created_at", { ascending: false }).range(from, to)

  // Apply search filter if provided
  if (searchTerm) {
    usersQuery = usersQuery.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
  }

  // Get users
  const { data, error } = await usersQuery

  if (error) {
    console.error("Kullanıcılar alınırken hata:", error.message)
    throw new Error(error.message)
  }

  // Get order count for each user
  const usersWithOrdersCount = await Promise.all(
    (data || []).map(async (user) => {
      const { count, error: countError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (countError) {
        console.error(`Kullanıcı ${user.id} için sipariş sayısı alınırken hata:`, countError.message)
      }

      return {
        ...user,
        orders_count: count || 0,
      }
    }),
  )

  return {
    users: usersWithOrdersCount || [],
    totalCount: count || 0,
  }
}

// Get a user by ID
export async function getUser(id: string): Promise<User | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Kullanıcı (ID: ${id}) alınırken hata:`, error.message)
    return null
  }

  return data
}

// Get user orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Kullanıcı siparişleri (Kullanıcı ID: ${userId}) alınırken hata:`, error.message)
    throw new Error(error.message)
  }

  return data || []
}

// Get all hero slides
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("hero_slides").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Hero slaytları alınırken hata:", error.message)
    throw new Error(error.message)
  }

  return data || []
}

// Get a hero slide by ID
export async function getHeroSlide(id: number): Promise<HeroSlide | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("hero_slides").select("*").eq("id", id).single()

  if (error) {
    console.error(`Hero slayt (ID: ${id}) alınırken hata:`, error.message)
    return null
  }

  return data
}

// Create a new hero slide
export async function createHeroSlide(
  slide: Omit<HeroSlide, "id" | "created_at" | "updated_at">,
): Promise<HeroSlide | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("hero_slides")
    .insert([
      {
        ...slide,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("Hero slayt oluşturulurken hata:", error.message)
    throw new Error(error.message)
  }

  return data?.[0] || null
}

// Update a hero slide
export async function updateHeroSlide(id: number, slide: Partial<HeroSlide>): Promise<HeroSlide | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("hero_slides")
    .update({ ...slide, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Hero slayt (ID: ${id}) güncellenirken hata:`, error.message)
    throw new Error(error.message)
  }

  return data
}

// Delete a hero slide
export async function deleteHeroSlide(id: number): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("hero_slides").delete().eq("id", id)

  if (error) {
    console.error(`Hero slayt (ID: ${id}) silinirken hata:`, error.message)
    throw new Error(error.message)
  }
}

// Update hero slide order
export async function updateHeroSlideOrder(slides: { id: number; order_index: number }[]): Promise<void> {
  const supabase = getSupabaseClient()

  // Use a transaction to update all slides
  const updates = slides.map((slide) => {
    return supabase
      .from("hero_slides")
      .update({ order_index: slide.order_index, updated_at: new Date().toISOString() })
      .eq("id", slide.id)
  })

  // Execute all updates
  await Promise.all(updates)
}
