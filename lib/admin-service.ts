import { supabase } from "./supabase-client"

// Define AdminUser type
export type AdminUser = {
  id: number
  email: string
  full_name: string
  is_super_admin: boolean
  last_login: string
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: number
  product_id: number
  url: string
  is_primary: boolean
}

export type HeroSlide = {
  id: number
  image_url: string
  title: string
  subtitle: string | null
  description: string | null
  order_index: number
  is_active: boolean
}

export type Order = {
  id: number
  user_id: string | null
  total_amount: number
  status: string
  payment_method: string
  payment_status: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  contact_phone: string
  created_at: string
  updated_at: string
  guest_email: string | null
  tracking_number: string | null
  user_email?: string
  items?: any[]
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
}

// Kategori tipi
export type Category = {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
}

// Ürün tipi
export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  discount_percentage?: number
  is_new?: boolean
  is_on_sale?: boolean
  stock: number
  category_id: number
  images?: string[] // Client-side representation of images
  image_urls?: string[] // Database column for image URLs
  features?: string[]
  specifications?: Record<string, string>
  created_at: string
  category?: Category
}

// Admin login function
export async function adminLogin(
  email: string,
  password: string,
): Promise<{ user: AdminUser | null; error: string | null }> {
  // Placeholder implementation - replace with actual login logic
  if (email === "admin@divonahome.com" && password === "password") {
    const user: AdminUser = {
      id: 1,
      email: "admin@divonahome.com",
      full_name: "Admin User",
      is_super_admin: true,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return { user, error: null }
  } else {
    return { user: null, error: "Invalid credentials" }
  }
}

// Get all categories
export async function getCategories(searchTerm = ""): Promise<Category[]> {
  try {
    let query = supabase.from("categories").select("*")

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`)
    }

    const { data, error } = await query.order("name")

    if (error) {
      console.error("Kategoriler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data as Category[]
  } catch (error) {
    console.error("Kategoriler alınırken hata:", error)
    return []
  }
}

// Create a new category
export async function createCategory(category: Omit<Category, "id">): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").insert([category]).select().single()

    if (error) {
      console.error("Kategori oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data as Category
  } catch (error) {
    console.error("Kategori oluşturulurken hata:", error)
    return null
  }
}

// Update a category
export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").update(category).eq("id", id).select().single()

    if (error) {
      console.error(`Kategori (ID: ${id}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as Category
  } catch (error) {
    console.error(`Kategori (ID: ${id}) güncellenirken hata:`, error)
    return null
  }
}

// Delete a category
export async function deleteCategory(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error(`Kategori (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Kategori (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Get all products with optional filtering
export async function getProducts(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ products: Product[]; totalCount: number }> {
  try {
    let query = supabase.from("products").select(`*, category:categories(name)`, { count: "exact" })

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Ürünler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    // Ürünlerin resimlerini al
    const productsWithImages = await Promise.all(
      data?.map(async (product) => {
        // Önce ürünün image_urls alanını kontrol et
        if (product.image_urls && product.image_urls.length > 0) {
          return { ...product, images: product.image_urls }
        }

        // Eğer image_urls yoksa, product_images tablosundan resimleri al
        const { data: imageData } = await supabase
          .from("product_images")
          .select("url")
          .eq("product_id", product.id)
          .order("is_primary", { ascending: false })

        const images = imageData && imageData.length > 0 ? imageData.map((img) => img.url) : []

        // Ürünün image_urls alanını güncelle
        if (images.length > 0) {
          await supabase.from("products").update({ image_urls: images }).eq("id", product.id)
        }

        return { ...product, images }
      }) || [],
    )

    return { products: productsWithImages, totalCount: count || 0 }
  } catch (error) {
    console.error("Ürünler alınırken hata:", error)
    return { products: [], totalCount: 0 }
  }
}

// Get a single product by ID
export async function getProduct(id: number): Promise<Product | null> {
  try {
    // Check if id is valid
    if (isNaN(id) || id <= 0) {
      console.error(`Geçersiz ürün ID: ${id}`)
      return null
    }

    const { data, error } = await supabase.from("products").select(`*, category:categories(name)`).eq("id", id).single()

    if (error) {
      console.error(`Ürün (ID: ${id}) alınırken hata:`, error.message)
      return null
    }

    // Ürünün resimlerini al
    const { data: imageData } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("is_primary", { ascending: false })

    const images = imageData || []
    const imageUrls = images.map((img) => img.url)

    return { ...data, images: imageUrls }
  } catch (error) {
    console.error(`Ürün (ID: ${id}) alınırken hata:`, error)
    return null
  }
}

// Create a new product
export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").insert([product]).select().single()

    if (error) {
      console.error("Ürün oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data as Product
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error)
    return null
  }
}

// Update a product
export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single()

    if (error) {
      console.error(`Ürün (ID: ${id}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as Product
  } catch (error) {
    console.error(`Ürün (ID: ${id}) güncellenirken hata:`, error)
    return null
  }
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  try {
    // Önce ürüne ait resimleri sil
    await supabase.from("product_images").delete().eq("product_id", id)

    // Sonra ürünü sil
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error(`Ürün (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Ürün (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Get site settings with fallback values
export async function getSiteSettings(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Site ayarları alınırken hata:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Site ayarları alınırken hata:", error)
    return []
  }
}

// Update multiple settings
export async function updateMultipleSettings(settings: { key: string; value: string }[]): Promise<void> {
  try {
    for (const setting of settings) {
      const { error } = await supabase.from("site_settings").upsert(
        {
          key: setting.key,
          value: setting.value,
        },
        { onConflict: "key" },
      )

      if (error) {
        console.error(`Ayarlar (Key: ${setting.key}) güncellenirken hata:`, error.message)
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error)
    throw error
  }
}

// Get all hero slides
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase.from("hero_slides").select("*").order("order_index")

    if (error) {
      console.error("Hero slaytları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return (data as HeroSlide[]) || []
  } catch (error) {
    console.error("Hero slaytları alınırken hata:", error)
    return []
  }
}

// Create a new hero slide
export async function createHeroSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabase.from("hero_slides").insert([slide]).select().single()

    if (error) {
      console.error("Hero slayt oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data as HeroSlide
  } catch (error) {
    console.error("Hero slayt oluşturulurken hata:", error)
    return null
  }
}

// Update a hero slide
export async function updateHeroSlide(id: number, slide: Partial<HeroSlide>): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabase.from("hero_slides").update(slide).eq("id", id).select().single()

    if (error) {
      console.error(`Hero slayt (ID: ${id}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as HeroSlide
  } catch (error) {
    console.error(`Hero slayt (ID: ${id}) güncellenirken hata:`, error)
    return null
  }
}

// Delete a hero slide
export async function deleteHeroSlide(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id)

    if (error) {
      console.error(`Hero slayt (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Hero slayt (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Update order index for hero slides
export async function updateHeroSlideOrder(slides: { id: number; order_index: number }[]): Promise<void> {
  try {
    for (const slide of slides) {
      const { error } = await supabase.from("hero_slides").update({ order_index: slide.order_index }).eq("id", slide.id)

      if (error) {
        console.error(`Hero slayt (ID: ${slide.id}) sırası güncellenirken hata:`, error.message)
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error("Hero slayt sırası güncellenirken hata:", error)
    throw error
  }
}

// Get all users with pagination and search
export async function getUsers(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ users: any[]; totalCount: number }> {
  try {
    let query = supabase.from("users").select("*", { count: "exact" })

    if (searchTerm) {
      query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Kullanıcılar alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { users: data || [], totalCount: count || 0 }
  } catch (error) {
    console.error("Kullanıcılar alınırken hata:", error)
    return { users: [], totalCount: 0 }
  }
}

// Get all orders with pagination, filtering and search
export async function getOrders(
  page = 1,
  itemsPerPage = 10,
  statusFilter?: string,
  searchTerm?: string,
): Promise<{ orders: Order[]; totalCount: number }> {
  try {
    let query = supabase.from("orders").select("*", { count: "exact" })

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    if (searchTerm) {
      query = query.or(
        `id::text.ilike.%${searchTerm}%,guest_email.ilike.%${searchTerm}%,tracking_number.ilike.%${searchTerm}%`,
      )
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Siparişler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { orders: (data as Order[]) || [], totalCount: count || 0 }
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return { orders: [], totalCount: 0 }
  }
}

// Get order details including items
export async function getOrderDetails(orderId: number): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*, product:products(name, price, image_urls))`)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error(`Sipariş detayları (ID: ${orderId}) alınırken hata:`, error.message)
      return null
    }

    return data
  } catch (error) {
    console.error(`Sipariş detayları (ID: ${orderId}) alınırken hata:`, error)
    return null
  }
}

// Update order status
export async function updateOrderStatus(orderId: number, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) {
      console.error(`Sipariş durumu (ID: ${orderId}) güncellenirken hata:`, error.message)
      return false
    }

    return true
  } catch (error) {
    console.error(`Sipariş durumu (ID: ${orderId}) güncellenirken hata:`, error)
    return false
  }
}

// Delete a product image
export async function deleteProductImage(imageId: number): Promise<void> {
  try {
    // Önce resim bilgilerini al
    const { data: imageData, error: fetchError } = await supabase
      .from("product_images")
      .select("product_id, url")
      .eq("id", imageId)
      .single()

    if (fetchError) {
      console.error(`Resim bilgileri (ID: ${imageId}) alınırken hata:`, fetchError.message)
      throw new Error(fetchError.message)
    }

    // Resmi veritabanından sil
    const { error } = await supabase.from("product_images").delete().eq("id", imageId)

    if (error) {
      console.error(`Resim (ID: ${imageId}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }

    // Ürünün image_urls alanını güncelle
    if (imageData && imageData.product_id) {
      await updateProductImageUrls(imageData.product_id)
    }
  } catch (error) {
    console.error(`Resim (ID: ${imageId}) silinirken hata:`, error)
    throw error
  }
}

// Get product images
export async function getProductImages(productId: number): Promise<ProductImage[]> {
  try {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })

    if (error) {
      console.error(`Ürün resimleri (Ürün ID: ${productId}) alınırken hata:`, error.message)
      throw new Error(error.message)
    }

    return (data as ProductImage[]) || []
  } catch (error) {
    console.error(`Ürün resimleri (Ürün ID: ${productId}) alınırken hata:`, error)
    return []
  }
}

// Set primary image
export async function setPrimaryImage(imageId: number, productId: number): Promise<boolean> {
  try {
    // First, set all images of this product to non-primary
    const { error: resetError } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId)

    if (resetError) {
      console.error(`Ürün resimleri (Ürün ID: ${productId}) güncellenirken hata:`, resetError.message)
      throw new Error(resetError.message)
    }

    // Then, set the selected image as primary
    const { error } = await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId)

    if (error) {
      console.error(`Ana resim (ID: ${imageId}) ayarlanırken hata:`, error.message)
      throw new Error(error.message)
    }

    // Ürünün image_urls alanını güncelle
    await updateProductImageUrls(productId)

    return true
  } catch (error) {
    console.error(`Ana resim (ID: ${imageId}) ayarlanırken hata:`, error)
    return false
  }
}

// Add product image
export async function addProductImage(productId: number, url: string, isPrimary = false): Promise<ProductImage | null> {
  try {
    // If this is the primary image, reset other images first
    if (isPrimary) {
      const { error: resetError } = await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId)

      if (resetError) {
        console.error(`Ürün resimleri (Ürün ID: ${productId}) güncellenirken hata:`, resetError.message)
        throw new Error(resetError.message)
      }
    }

    // Add the new image
    const { data, error } = await supabase
      .from("product_images")
      .insert([
        {
          product_id: productId,
          url,
          is_primary: isPrimary,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error(`Ürün resmi eklenirken hata:`, error.message)
      throw new Error(error.message)
    }

    // Update the product's image_urls array
    await updateProductImageUrls(productId)

    return data as ProductImage
  } catch (error) {
    console.error(`Ürün resmi eklenirken hata:`, error)
    return null
  }
}

// Update product image_urls field based on product_images table
export async function updateProductImageUrls(productId: number): Promise<boolean> {
  try {
    // Get all images for this product
    const { data: images, error: fetchError } = await supabase
      .from("product_images")
      .select("url, is_primary")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })

    if (fetchError) {
      console.error(`Ürün resimleri (Ürün ID: ${productId}) alınırken hata:`, fetchError.message)
      throw new Error(fetchError.message)
    }

    // Extract URLs
    const imageUrls = images.map((img) => img.url)

    // Update the product
    const { error: updateError } = await supabase.from("products").update({ image_urls: imageUrls }).eq("id", productId)

    if (updateError) {
      console.error(`Ürün (ID: ${productId}) resim URL'leri güncellenirken hata:`, updateError.message)
      throw new Error(updateError.message)
    }

    return true
  } catch (error) {
    console.error(`Ürün (ID: ${productId}) resim URL'leri güncellenirken hata:`, error)
    return false
  }
}
