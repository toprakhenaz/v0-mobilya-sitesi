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
    // Try to get from database first
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })

    if (error) {
      console.log("Database error when fetching product images, using fallback:", error)
      return await getProductImagesFromFile(productId)
    }

    // If no data or empty array, try fallback
    if (!data || data.length === 0) {
      const fileImages = await getProductImagesFromFile(productId)
      if (fileImages && fileImages.length > 0) {
        return fileImages
      }
    }

    return data
  } catch (error) {
    // If any error, fall back to file storage
    console.error("Error fetching product images:", error)
    return await getProductImagesFromFile(productId)
  }
}

// Set primary image
export async function setPrimaryImage(imageId: number, productId: number) {
  try {
    // First, reset all images for this product to not primary
    const { error } = await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId)

    if (error) {
      console.error("Database error when updating primary image:", error)
      // Try file fallback
      return await setPrimaryImageInFile(imageId, productId)
    }

    // Then set the selected image as primary
    const { error: updateError } = await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId)

    if (updateError) {
      console.error("Database error when setting primary image:", updateError)
      // Try file fallback
      return await setPrimaryImageInFile(imageId, productId)
    }

    return true
  } catch (error) {
    console.error("Error setting primary image:", error)
    // Fall back to file storage
    return await setPrimaryImageInFile(imageId, productId)
  }
}

// Add a new function to set primary image in file
async function setPrimaryImageInFile(imageId: number, productId: number) {
  try {
    if (!fs.existsSync(PRODUCT_IMAGES_FILE)) {
      return false
    }

    const fileData = await readFile(PRODUCT_IMAGES_FILE, "utf8")
    let images = JSON.parse(fileData || "[]")

    // Reset all images for this product to not primary
    images = images.map((img: any) => {
      if (img.product_id === productId) {
        return { ...img, is_primary: img.id === imageId }
      }
      return img
    })

    await fs.promises.writeFile(PRODUCT_IMAGES_FILE, JSON.stringify(images, null, 2), "utf8")
    return true
  } catch (fileError) {
    console.error("Error updating primary image in file:", fileError)
    return false
  }
}

// Delete product image
export async function deleteProductImage(imageId: number) {
  try {
    // Try database first
    const { error } = await supabase.from("product_images").delete().eq("id", imageId)

    if (error) {
      throw new Error("Database error when deleting image")
    }

    return true
  } catch (error) {
    // Fall back to file storage
    try {
      if (!fs.existsSync(PRODUCT_IMAGES_FILE)) {
        return false
      }

      const fileData = await readFile(PRODUCT_IMAGES_FILE, "utf8")
      let images = JSON.parse(fileData || "[]")

      // Filter out the image to delete
      images = images.filter((img: any) => img.id !== imageId)

      await fs.promises.writeFile(PRODUCT_IMAGES_FILE, JSON.stringify(images, null, 2), "utf8")
      return true
    } catch (fileError) {
      console.error("Error deleting image from file:", fileError)
      return false
    }
  }
}
