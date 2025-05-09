import prisma from "./prisma"
import type { Product, Category, HeroSlide, AdminUser } from "@prisma/client"

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

  return {
    ...product,
    images: product.product_images || [],
    image_urls: imageUrls,
    features,
    specifications,
  }
}

// Admin login function
export async function adminLogin(
  email: string,
  password: string,
): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    // Bu örnek için basit bir doğrulama kullanıyoruz
    // Gerçek uygulamada şifre hash'leme ve güvenli doğrulama kullanılmalıdır
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || admin.password_hash !== password) {
      return { user: null, error: "Invalid credentials" }
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { last_login: new Date() },
    })

    return { user: admin, error: null }
  } catch (error) {
    console.error("Error during admin login:", error)
    return { user: null, error: "An error occurred during login" }
  }
}

// Get all categories
export async function getCategories(searchTerm = ""): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: searchTerm
        ? {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        name: "asc",
      },
    })

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await prisma.product.count({
          where: { category_id: category.id },
        })
        return {
          ...category,
          product_count: productCount,
        }
      }),
    )

    return categoriesWithCount as any[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Create a new category
export async function createCategory(
  category: Omit<Category, "id" | "created_at" | "updated_at">,
): Promise<Category | null> {
  try {
    const newCategory = await prisma.category.create({
      data: category,
    })

    return newCategory
  } catch (error) {
    console.error("Error creating category:", error)
    return null
  }
}

// Update a category
export async function updateCategory(
  id: number,
  category: Partial<Omit<Category, "id" | "created_at" | "updated_at">>,
): Promise<Category | null> {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: category,
    })

    return updatedCategory
  } catch (error) {
    console.error(`Error updating category (ID: ${id}):`, error)
    return null
  }
}

// Delete a category
export async function deleteCategory(id: number): Promise<void> {
  try {
    await prisma.category.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error deleting category (ID: ${id}):`, error)
    throw error
  }
}

// Get all products with optional filtering
export async function getProducts(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ products: any[]; totalCount: number }> {
  try {
    const where = searchTerm
      ? {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }
      : undefined

    const totalCount = await prisma.product.count({ where })

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        created_at: "desc",
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        product_images: true,
      },
    })

    return {
      products: products.map(processProduct),
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { products: [], totalCount: 0 }
  }
}

// Get a single product by ID
export async function getProduct(id: number): Promise<any | null> {
  try {
    if (isNaN(id) || id <= 0) {
      console.error(`Invalid product ID: ${id}`)
      return null
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        product_images: true,
      },
    })

    if (!product) {
      return null
    }

    return processProduct(product)
  } catch (error) {
    console.error(`Error fetching product (ID: ${id}):`, error)
    return null
  }
}

// Create a new product
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">,
): Promise<Product | null> {
  try {
    // Convert arrays and objects to JSON strings
    const productData = {
      ...product,
      features: product.features ? JSON.stringify(product.features) : null,
      specifications: product.specifications ? JSON.stringify(product.specifications) : null,
      image_urls: product.image_urls ? JSON.stringify(product.image_urls) : null,
    }

    const newProduct = await prisma.product.create({
      data: productData as any,
    })

    return newProduct
  } catch (error) {
    console.error("Error creating product:", error)
    return null
  }
}

// Update a product
export async function updateProduct(
  id: number,
  product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
): Promise<Product | null> {
  try {
    // Convert arrays and objects to JSON strings if they exist
    const productData: any = { ...product }

    if (product.features) {
      productData.features = JSON.stringify(product.features)
    }

    if (product.specifications) {
      productData.specifications = JSON.stringify(product.specifications)
    }

    if (product.image_urls) {
      productData.image_urls = JSON.stringify(product.image_urls)
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    })

    return updatedProduct
  } catch (error) {
    console.error(`Error updating product (ID: ${id}):`, error)
    return null
  }
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  try {
    await prisma.product.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error deleting product (ID: ${id}):`, error)
    throw error
  }
}

// Delete a product image
export async function deleteProductImage(imageId: number): Promise<void> {
  try {
    await prisma.productImage.delete({
      where: { id: imageId },
    })
  } catch (error) {
    console.error(`Error deleting image (ID: ${imageId}):`, error)
    throw error
  }
}

// Get order details
export async function getOrderDetails(orderId: number): Promise<any | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return null
    }

    return order
  } catch (error) {
    console.error(`Error fetching order details (ID: ${orderId}):`, error)
    return null
  }
}

// Update order status
export async function updateOrderStatus(orderId: number, status: string): Promise<boolean> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updated_at: new Date(),
      },
    })

    return true
  } catch (error) {
    console.error(`Error updating order status (ID: ${orderId}):`, error)
    return false
  }
}

// Get site settings
export async function getSiteSettings(): Promise<any[]> {
  try {
    const settings = await prisma.siteSetting.findMany()
    return settings
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return []
  }
}

// Update multiple settings
export async function updateMultipleSettings(settings: { key: string; value: string }[]): Promise<void> {
  try {
    for (const setting of settings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
    }
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
}

// Get all hero slides
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: {
        order_index: "asc",
      },
    })

    return slides
  } catch (error) {
    console.error("Error fetching hero slides:", error)
    return []
  }
}

// Create a new hero slide
export async function createHeroSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide | null> {
  try {
    const newSlide = await prisma.heroSlide.create({
      data: slide,
    })

    return newSlide
  } catch (error) {
    console.error("Error creating hero slide:", error)
    return null
  }
}

// Update a hero slide
export async function updateHeroSlide(id: number, slide: Partial<Omit<HeroSlide, "id">>): Promise<HeroSlide | null> {
  try {
    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: slide,
    })

    return updatedSlide
  } catch (error) {
    console.error(`Error updating hero slide (ID: ${id}):`, error)
    return null
  }
}

// Delete a hero slide
export async function deleteHeroSlide(id: number): Promise<void> {
  try {
    await prisma.heroSlide.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error deleting hero slide (ID: ${id}):`, error)
    throw error
  }
}

// Update order index for hero slides
export async function updateHeroSlideOrder(slides: { id: number; order_index: number }[]): Promise<void> {
  try {
    for (const slide of slides) {
      await prisma.heroSlide.update({
        where: { id: slide.id },
        data: { order_index: slide.order_index },
      })
    }
  } catch (error) {
    console.error("Error updating hero slide order:", error)
    throw error
  }
}

// Get all users
export async function getUsers(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ users: any[]; totalCount: number }> {
  try {
    const where = searchTerm
      ? {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }
      : undefined

    const totalCount = await prisma.user.count({ where })

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        created_at: "desc",
      },
    })

    // Get order count for each user
    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const ordersCount = await prisma.order.count({
          where: { user_id: user.id },
        })
        return {
          ...user,
          orders_count: ordersCount,
        }
      }),
    )

    return {
      users: usersWithOrderCount,
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { users: [], totalCount: 0 }
  }
}

// Get all orders with optional filtering
export async function getOrders(
  page = 1,
  itemsPerPage = 10,
  statusFilter?: string,
  searchTerm?: string,
): Promise<{ orders: any[]; totalCount: number }> {
  try {
    // Build where clause
    const where: any = {}

    if (statusFilter && statusFilter !== "all") {
      where.status = statusFilter
    }

    if (searchTerm) {
      where.id = {
        equals: Number.parseInt(searchTerm, 10) || undefined,
      }
    }

    const totalCount = await prisma.order.count({ where })

    const orders = await prisma.order.findMany({
      where,
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    })

    // Add user_email field
    const ordersWithEmail = orders.map((order) => ({
      ...order,
      user_email: order.user?.email || order.guest_email || "Misafir Kullanıcı",
    }))

    return {
      orders: ordersWithEmail,
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { orders: [], totalCount: 0 }
  }
}
