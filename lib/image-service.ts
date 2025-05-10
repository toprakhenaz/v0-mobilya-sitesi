import { supabase } from "./supabase-client"
import fs from "fs"
import path from "path"
import { readFile } from "fs/promises"

// Define types
export type ProductImage = {
  id: string
  product_id: number
  url: string
  is_primary: boolean
  created_at: string
}

// Path to the JSON file that stores our image data as fallback
const DATA_DIR = path.join(process.cwd(), "data")
const PRODUCT_IMAGES_FILE = path.join(DATA_DIR, "product-images.json")

// Get product images from JSON file
async function getProductImagesFromFile(productId: number) {
  try {
    if (!fs.existsSync(PRODUCT_IMAGES_FILE)) {
      return []
    }

    const fileData = await readFile(PRODUCT_IMAGES_FILE, "utf8")
    const images = JSON.parse(fileData || "[]")

    return images.filter((img: any) => img.product_id === productId)
  } catch (error) {
    console.error("Error reading product images from file:", error)
    return []
  }
}

// Save product image to JSON file
export async function saveProductImage(productId: number, url: string, isPrimary = false) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Read existing images
    let images = []
    if (fs.existsSync(PRODUCT_IMAGES_FILE)) {
      const fileData = await readFile(PRODUCT_IMAGES_FILE, "utf8")
      images = JSON.parse(fileData || "[]")
    }

    // Create new image entry
    const newImage = {
      id: Date.now(),
      product_id: productId,
      url: url,
      is_primary: isPrimary,
      created_at: new Date().toISOString(),
    }

    // Add to images array
    images.push(newImage)

    // Write back to file
    await fs.promises.writeFile(PRODUCT_IMAGES_FILE, JSON.stringify(images, null, 2), "utf8")

    return newImage
  } catch (error) {
    console.error("Error saving product image to file:", error)
    return null
  }
}

// Get product images
export async function getProductImages(productId: number) {
  try {
    // Get product from database to access image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error) {
      console.log("Database error when fetching product images, using fallback:", error)
      return await getProductImagesFromFile(productId)
    }

    // Convert image_urls array to ProductImage format
    if (data && data.image_urls && Array.isArray(data.image_urls)) {
      return data.image_urls.map((url, index) => ({
        id: `${productId}-${index}`,
        product_id: productId,
        url: url,
        is_primary: index === 0, // First image is primary
        created_at: new Date().toISOString(),
      }))
    }

    return []
  } catch (error) {
    // If any error, fall back to file storage
    console.error("Error fetching product images:", error)
    return await getProductImagesFromFile(productId)
  }
}

// Set primary image
export async function setPrimaryImage(imageId: string, productId: number) {
  try {
    // Get current image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error || !data || !data.image_urls) {
      throw new Error("Database error when updating primary image")
    }

    // Find the index of the image to make primary
    const imageIndex = Number.parseInt(imageId.split("-")[1], 10)

    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= data.image_urls.length) {
      throw new Error("Invalid image index")
    }

    // Reorder the array to make the selected image first
    const newImageUrls = [...data.image_urls]
    const primaryImage = newImageUrls.splice(imageIndex, 1)[0]
    newImageUrls.unshift(primaryImage)

    // Update the product with the new image_urls order
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: newImageUrls })
      .eq("id", productId)

    if (updateError) {
      throw new Error("Database error when setting primary image")
    }

    return true
  } catch (error) {
    console.error("Error updating primary image:", error)
    return false
  }
}

// Delete product image
export async function deleteProductImage(imageId: string) {
  try {
    // Parse the image ID to get product ID and image index
    const [productId, imageIndex] = imageId.split("-").map(Number)

    if (isNaN(productId) || isNaN(imageIndex)) {
      throw new Error("Invalid image ID format")
    }

    // Get current image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error || !data || !data.image_urls) {
      throw new Error("Database error when deleting image")
    }

    // Remove the image at the specified index
    const newImageUrls = [...data.image_urls]
    if (imageIndex < 0 || imageIndex >= newImageUrls.length) {
      throw new Error("Image index out of bounds")
    }

    newImageUrls.splice(imageIndex, 1)

    // Update the product with the new image_urls array
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: newImageUrls })
      .eq("id", productId)

    if (updateError) {
      throw new Error("Database error when updating image_urls")
    }

    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}
