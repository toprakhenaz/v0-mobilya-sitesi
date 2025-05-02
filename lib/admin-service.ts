import { supabase } from "./supabase-client"
import type { Product, Category, User } from "./supabase"

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

// Define HeroSlide type
export type HeroSlide = {
  id: number
  image_url: string
  title: string
  subtitle: string | null
  description: string | null
  order_index: number
  is_active: boolean
}

export type ProductImage = {
  id: number
  product_id: number
  url: string
  is_primary: boolean
}

export type Order = {
  id: string
  created_at: string
  user_id: string
  total_amount: number
  status: string
  payment_method: string
  shipping_address: string
  billing_address: string
  items: any[]
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
}

// Admin authentication
// adminLogin fonksiyonunu daha güvenilir hale getirelim ve hata ayıklama ekleyelim

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    console.log("Admin giriş denemesi:", email) // Giriş denemesini konsola yazdır

    // Giriş bilgilerini kontrol et (büyük/küçük harf duyarsız e-posta kontrolü)
    if (email.toLowerCase() === "admin@divonahome.com" && password === "password") {
      console.log("Giriş başarılı")
      const user = {
        id: 1,
        email: "admin@divonahome.com",
        full_name: "Admin User",
        is_super_admin: true,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return { user: user, error: null }
    } else {
      console.log("Giriş başarısız: Geçersiz kimlik bilgileri")
      return { user: null, error: "Geçersiz e-posta veya şifre" }
    }
  } catch (error) {
    console.error("Giriş yapılırken bir hata oluştu:", error)
    return { user: null, error: "Giriş yapılırken bir hata oluştu" }
  }
}

// Get all products
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

    return { products: data as Product[], totalCount: count || 0 }
  } catch (error) {
    console.error("Ürünler alınırken hata:", error)
    return { products: [], totalCount: 0 }
  }
}

// Get a product by ID
export async function getProduct(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error(`Ürün (ID: ${id}) alınırken hata:`, error.message)
      return null
    }

    return data as Product
  } catch (error) {
    console.error(`Ürün (ID: ${id}) alınırken hata:`, error)
    return null
  }
}

// Create a new product
export async function createProduct(product: any): Promise<Product | null> {
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
export async function updateProduct(id: number, product: any): Promise<Product | null> {
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

// Delete a product image
export async function deleteProductImage(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("product_images").delete().eq("id", id)

    if (error) {
      console.error(`Ürün resmi (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Ürün resmi (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Get all users
export async function getUsers(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ users: User[]; totalCount: number }> {
  try {
    let query = supabase.from("users").select("*", { count: "exact" })

    if (searchTerm) {
      query = query.ilike("email", `%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Kullanıcılar alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { users: data as User[], totalCount: count || 0 }
  } catch (error) {
    console.error("Kullanıcılar alınırken hata:", error)
    return { users: [], totalCount: 0 }
  }
}

// Create a new category
export async function createCategory(category: any): Promise<Category | null> {
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
export async function updateCategory(id: number, category: any): Promise<Category | null> {
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

// Get all categories
export async function getCategories(searchTerm = ""): Promise<Category[]> {
  try {
    let query = supabase.from("categories").select("*")

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`)
    }

    const { data, error } = await query.order("name", { ascending: true })

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

// Get site settings
export async function getSiteSettings() {
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

// Update multiple settings at once
export async function updateMultipleSettings(settings: { key: string; value: string }[]) {
  try {
    // Use upsert to handle both insert and update
    const { error } = await supabase.from("site_settings").upsert(
      settings.map((setting) => ({
        key: setting.key,
        value: setting.value,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "key" },
    )

    if (error) {
      console.error("Ayarlar güncellenirken hata:", error.message)
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error)
    throw error
  }
}

// Update a single setting
export async function updateSetting(key: string, value: string) {
  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })

    if (error) {
      console.error(`Ayar (${key}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return true
  } catch (error) {
    console.error(`Ayar (${key}) güncellenirken hata:`, error)
    throw error
  }
}

// Get hero slides
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase.from("hero_slides").select("*").order("order_index", { ascending: true })

    if (error) {
      console.error("Hero slaytları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return (data as any[]) || []
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

// Update hero slide order
export async function updateHeroSlideOrder(slides: { id: number; order_index: number }[]): Promise<void> {
  try {
    // Use a single database call to update all slides
    const { error } = await supabase.from("hero_slides").upsert(
      slides.map((slide) => ({ id: slide.id, order_index: slide.order_index })),
      { onConflict: "id" },
    )

    if (error) {
      console.error("Hero slayt sırası güncellenirken hata:", error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Hero slayt sırası güncellenirken hata:", error)
    throw error
  }
}

// Get all orders
export async function getOrders(
  page = 1,
  itemsPerPage = 10,
  status?: string,
  searchTerm?: string,
): Promise<{ orders: Order[]; totalCount: number }> {
  try {
    let query = supabase.from("orders").select("*", { count: "exact" })

    if (status) {
      query = query.eq("status", status)
    }

    if (searchTerm) {
      query = query.ilike("id", `%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Siparişler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { orders: data as Order[], totalCount: count || 0 }
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return { orders: [], totalCount: 0 }
  }
}
