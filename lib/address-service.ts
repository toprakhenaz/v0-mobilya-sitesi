import prisma from "./prisma"
import type { Address } from "@prisma/client"

export async function getAddressesByUserId(userId: string): Promise<Address[]> {
  try {
    const addresses = await prisma.address.findMany({
      where: {
        user_id: userId,
      },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
    })

    return addresses
  } catch (error) {
    console.error("Error fetching addresses:", error)
    throw error
  }
}

export async function createAddress(address: Omit<Address, "id">): Promise<Address> {
  try {
    // If this address is set as default, update other default addresses
    if (address.is_default) {
      await prisma.address.updateMany({
        where: {
          user_id: address.user_id,
          is_default: true,
        },
        data: {
          is_default: false,
        },
      })
    }

    const newAddress = await prisma.address.create({
      data: address,
    })

    return newAddress
  } catch (error) {
    console.error("Error creating address:", error)
    throw error
  }
}

export async function updateAddress(id: number, address: Partial<Address>): Promise<Address> {
  try {
    // If this address is set as default, update other default addresses
    if (address.is_default && address.user_id) {
      await prisma.address.updateMany({
        where: {
          user_id: address.user_id,
          is_default: true,
        },
        data: {
          is_default: false,
        },
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: address,
    })

    return updatedAddress
  } catch (error) {
    console.error("Error updating address:", error)
    throw error
  }
}

export async function deleteAddress(id: number): Promise<void> {
  try {
    await prisma.address.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Error deleting address:", error)
    throw error
  }
}
