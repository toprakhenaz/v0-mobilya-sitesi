import { supabase } from "@/lib/supabase-client"

// Define the ProductImage type
export interface ProductImage {
  id: number
  product_id: number
  url: string
  is_primary: boolean
  created_at?: string
}

// Update product image_urls field based on product_images table
export async function updateProductImageUrls(productId: number): Promise<boolean> {
  try {
    console.log("updateProductImageUrls çağrıldı:", productId)

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

    console.log("Bulunan resimler:", images)

    // Extract URLs
    const imageUrls = images.map((img) => img.url)

    console.log("Güncellenecek image_urls:", imageUrls)

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

// Add product image
export async function addProductImage(productId: number, url: string, isPrimary = false): Promise<ProductImage | null> {
  try {
    console.log(`addProductImage çağrıldı: productId=${productId}, url=${url}, isPrimary=${isPrimary}`)

    // If this is the primary image, reset other images first
    if (isPrimary) {
      console.log("Bu ana resim, diğer resimleri sıfırlıyorum")
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

    if (error) {
      console.error(`Ürün resmi eklenirken hata:`, error.message)
      throw new Error(error.message)
    }

    console.log("Resim başarıyla eklendi:", data)

    // Update the product's image_urls field
    await updateProductImageUrls(productId)

    // Return the first image if available
    return data && data.length > 0 ? (data[0] as ProductImage) : null
  } catch (error) {
    console.error(`Ürün resmi eklenirken hata:`, error)
    return null
  }
}

export type AdminUser = {
  id: string
  email: string
  full_name?: string
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    const user: AdminUser = {
      id: data.user.id,
      email: data.user.email,
    }

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export async function getSiteSettings(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Site ayarları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Site ayarları alınırken hata:", error)
    return []
  }
}

export type Category = {
  id: number
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  created_at?: string
}

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

    return data || []
  } catch (error) {
    console.error("Kategoriler alınırken hata:", error)
    return []
  }
}

export async function createCategory(category: Omit<Category, "id">): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").insert([category]).select().single()

    if (error) {
      console.error("Kategori oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Kategori oluşturulurken hata:", error)
    return null
  }
}

export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").update(category).eq("id", id).select().single()

    if (error) {
      console.error("Kategori güncellenirken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Kategori güncellenirken hata:", error)
    return null
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error("Kategori silinirken hata:", error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Kategori silinirken hata:", error)
  }
}

export async function updateMultipleSettings(settings: { key: string; value: string }[]): Promise<void> {
  try {
    for (const setting of settings) {
      const { error } = await supabase.from("site_settings").upsert({ key: setting.key, value: setting.value })

      if (error) {
        console.error(`Ayarlar güncellenirken hata (${setting.key}):`, error.message)
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error)
    throw error
  }
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

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase.from("hero_slides").select("*").order("order_index")

    if (error) {
      console.error("Hero slaytları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Hero slaytları alınırken hata:", error)
    return []
  }
}

export async function createHeroSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabase.from("hero_slides").insert([slide]).select().single()

    if (error) {
      console.error("Hero slayt oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Hero slayt oluşturulurken hata:", error)
    return null
  }
}

export async function updateHeroSlide(id: number, slide: Partial<HeroSlide>): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabase.from("hero_slides").update(slide).eq("id", id).select().single()

    if (error) {
      console.error("Hero slayt güncellenirken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Hero slayt güncellenirken hata:", error)
    return null
  }
}

export async function deleteHeroSlide(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id)

    if (error) {
      console.error("Hero slayt silinirken hata:", error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Hero slayt silinirken hata:", error)
  }
}

export async function updateHeroSlideOrder(slides: { id: number; order_index: number }[]): Promise<void> {
  try {
    for (const slide of slides) {
      const { error } = await supabase.from("hero_slides").update({ order_index: slide.order_index }).eq("id", slide.id)

      if (error) {
        console.error(`Slayt (ID: ${slide.id}) sırası güncellenirken hata:`, error.message)
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error("Slayt sırası güncellenirken hata:", error)
    throw error
  }
}

export type Order = {
  id: number
  user_id: string | null
  status: string
  total_amount: number
  shipping_address: string
  billing_address: string
  payment_method: string
  created_at: string
  updated_at: string
  tracking_number?: string | null
  items?: OrderItem[]
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export async function getOrders(
  page: number,
  limit: number,
  status?: string,
  searchTerm?: string,
): Promise<{ orders: Order[]; totalCount: number }> {
  try {
    let query = supabase.from("orders").select("*", { count: "exact" })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (searchTerm) {
      query = query.ilike("shipping_address", `%${searchTerm}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Siparişler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return {
      orders: data as Order[],
      totalCount: count || 0,
    }
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return { orders: [], totalCount: 0 }
  }
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  discount_percentage?: number
  is_new: boolean
  is_on_sale: boolean
  stock: number
  category_id: number
  images?: string[]
  image_urls?: string[]
  features?: string[]
  specifications?: Record<string, string>
  created_at: string
  category?: Category
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

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Ürün alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Ürün alınırken hata:", error)
    return null
  }
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single()

    if (error) {
      console.error("Ürün güncellenirken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Ürün güncellenirken hata:", error)
    return null
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").insert([product]).select().single()

    if (error) {
      console.error("Ürün oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error)
    return null
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Ürün silinirken hata:", error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Ürün silinirken hata:", error)
  }
}

export async function getUsers(
  page: number,
  limit: number,
  searchTerm = "",
): Promise<{
  users: {
    id: string
    email: string
    created_at: string
    last_sign_in_at: string | null
    orders_count: number
  }[]
  totalCount: number
}> {
  try {
    let query = supabase.from("users").select("*, orders_count:count", { count: "exact" })

    if (searchTerm) {
      query = query.ilike("email", `%${searchTerm}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Kullanıcılar alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return {
      users: data as any[],
      totalCount: count || 0,
    }
  } catch (error) {
    console.error("Kullanıcılar alınırken hata:", error)
    return { users: [], totalCount: 0 }
  }
}

export async function getOrderDetails(orderId: number): Promise<Order | null> {
  try {
    const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      console.error("Sipariş detayları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Sipariş detayları alınırken hata:", error)
    return null
  }
}

export async function updateOrderStatus(orderId: number, status: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

    if (error) {
      console.error("Sipariş durumu güncellenirken hata:", error.message)
      return false
    }

    return true
  } catch (error) {
    console.error("Sipariş durumu güncellenirken hata:", error)
    return false
  }
}

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
