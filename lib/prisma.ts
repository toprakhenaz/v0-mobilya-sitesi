import { PrismaClient } from "@prisma/client"

// PrismaClient'ın global bir örneğini oluştur
// NextJS'in geliştirme modunda hot-reloading nedeniyle çok fazla bağlantı oluşmasını önler
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
