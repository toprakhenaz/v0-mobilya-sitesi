import { supabase } from "./supabase-client"
import fs from "fs"
import path from "path"
import { readFile } from "fs/promises"

// Define types
export type OrderImage = {
  id: string
  order_id: number
  url: string
  created_at: string
  description?: string
}

// Path to the JSON file that stores our image data as fallback
const DATA_DIR = path.join(process.cwd(), "data")
const ORDER_IMAGES_FILE = path.join(DATA_DIR, "order-images.json")

// Get order images from JSON file
async function getOrderImagesFromFile(orderId: number) {
  try {
    if (!fs.existsSync(ORDER_IMAGES_FILE)) {
      return []
    }

    const fileData = await readFile(ORDER_IMAGES_FILE, "utf8")
    const images = JSON.parse(fileData || "[]")

    return images.filter((img: any) => img.order_id === orderId)
  } catch (error) {
    console.error("Error reading order images from file:", error)
    return []
  }
}

// Save order image to JSON file
export async function saveOrderImage(orderId: number, url: string, description?: string) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Read existing images
    let images = []
    if (fs.existsSync(ORDER_IMAGES_FILE)) {
      const fileData = await readFile(ORDER_IMAGES_FILE, "utf8")
      images = JSON.parse(fileData || "[]")
    }

    // Create new image entry
    const newImage = {
      id: Date.now().toString(),
      order_id: orderId,
      url: url,
      description: description || null,
      created_at: new Date().toISOString(),
    }

    // Add to images array
    images.push(newImage)

    // Write back to file
    await fs.promises.writeFile(ORDER_IMAGES_FILE, JSON.stringify(images, null, 2), "utf8")

    return newImage
  } catch (error) {
    console.error("Error saving order image to file:", error)
    return null
  }
}

// Get order images
export async function getOrderImages(orderId: number) {
  try {
    // Try to get from database first
    const { data, error } = await supabase.from("order_images").select("*").eq("order_id", orderId)

    if (error) {
      // If database error, fall back to file storage
      console.log("Database error when fetching order images, using fallback:", error)
      return await getOrderImagesFromFile(orderId)
    }

    // If no data or empty array, try fallback
    if (!data || data.length === 0) {
      const fileImages = await getOrderImagesFromFile(orderId)
      if (fileImages && fileImages.length > 0) {
        return fileImages
      }
    }

    return data
  } catch (error) {
    // If any error, fall back to file storage
    console.error("Error fetching order images:", error)
    return await getOrderImagesFromFile(orderId)
  }
}

// Delete order image
export async function deleteOrderImage(imageId: string) {
  try {
    // Try database first
    const { error } = await supabase.from("order_images").delete().eq("id", imageId)

    if (error) {
      throw new Error("Database error when deleting image")
    }

    return true
  } catch (error) {
    // Fall back to file storage
    try {
      if (!fs.existsSync(ORDER_IMAGES_FILE)) {
        return false
      }

      const fileData = await readFile(ORDER_IMAGES_FILE, "utf8")
      let images = JSON.parse(fileData || "[]")

      // Filter out the image to delete
      images = images.filter((img: any) => img.id !== imageId)

      await fs.promises.writeFile(ORDER_IMAGES_FILE, JSON.stringify(images, null, 2), "utf8")
      return true
    } catch (fileError) {
      console.error("Error deleting image from file:", fileError)
      return false
    }
  }
}
