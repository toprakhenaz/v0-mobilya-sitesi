import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password_hash: adminPassword,
      full_name: "Admin User",
      is_super_admin: true,
    },
  })
  console.log("Created admin user:", admin.email)

  // Create categories
  const categories = [
    { name: "Bahçe Oturma Grupları", slug: "bahce-oturma-gruplari", description: "Bahçeniz için şık oturma grupları" },
    { name: "Bahçe Köşe Takımları", slug: "bahce-kose-takimlari", description: "Bahçeniz için köşe takımları" },
    { name: "Masa Takımları", slug: "masa-takimlari", description: "Bahçe ve balkon için masa takımları" },
    { name: "Şezlonglar", slug: "sezlonglar", description: "Konforlu şezlonglar" },
    { name: "Sandalyeler", slug: "sandalyeler", description: "Bahçe sandalyeleri" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log(`Created ${categories.length} categories`)

  // Create products
  const products = [
    {
      name: "Rattan Bahçe Oturma Grubu",
      slug: "rattan-bahce-oturma-grubu",
      description: "Şık ve dayanıklı rattan bahçe oturma grubu",
      price: 12999.99,
      original_price: 15999.99,
      discount_percentage: 19,
      is_new: true,
      is_on_sale: true,
      stock: 10,
      category_id: 1,
      image_urls: JSON.stringify(["/products/rattan-bahce-oturma-grubu.jpg"]),
      features: JSON.stringify(["UV korumalı", "Suya dayanıklı", "Kolay temizlenir"]),
      specifications: JSON.stringify({
        Malzeme: "Rattan",
        Renk: "Kahverengi",
        "Kişi Sayısı": "4-6",
        Garanti: "2 Yıl",
      }),
    },
    {
      name: "Modern Bahçe Köşe Takımı",
      slug: "modern-bahce-kose-takimi",
      description: "Modern tasarımlı bahçe köşe takımı",
      price: 18999.99,
      original_price: 22999.99,
      discount_percentage: 17,
      is_new: true,
      is_on_sale: true,
      stock: 5,
      category_id: 2,
      image_urls: JSON.stringify(["/products/modern-bahce-kose-takimi.jpg"]),
      features: JSON.stringify(["Modüler tasarım", "Yüksek konfor", "Hava şartlarına dayanıklı"]),
      specifications: JSON.stringify({
        Malzeme: "Alüminyum + Kumaş",
        Renk: "Gri",
        "Kişi Sayısı": "6-8",
        Garanti: "3 Yıl",
      }),
    },
    {
      name: "Ahşap Masa Takımı",
      slug: "ahsap-masa-takimi",
      description: "Doğal ahşap bahçe masa takımı",
      price: 8999.99,
      original_price: 10999.99,
      discount_percentage: 18,
      is_new: false,
      is_on_sale: true,
      stock: 8,
      category_id: 3,
      image_urls: JSON.stringify(["/products/ahsap-masa-takimi.jpg"]),
      features: JSON.stringify(["Doğal ahşap", "Uzun ömürlü", "Klasik tasarım"]),
      specifications: JSON.stringify({
        Malzeme: "Tik Ağacı",
        Renk: "Naturel",
        "Kişi Sayısı": "6",
        Garanti: "5 Yıl",
      }),
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log(`Created ${products.length} products`)

  // Create hero slides
  const heroSlides = [
    {
      image_url: "/hero-1-new.jpg",
      title: "YAZ FIRSATLARI",
      subtitle: "Bahçe Mobilyalarında",
      description: "%30 İNDİRİM",
      order_index: 0,
      is_active: true,
    },
    {
      image_url: "/hero-2-new.jpg",
      title: "YENİ SEZON",
      subtitle: "Rattan Koleksiyonu",
      description: "HEMEN İNCELE",
      order_index: 1,
      is_active: true,
    },
    {
      image_url: "/hero-3-new.jpg",
      title: "ÖZEL TASARIM",
      subtitle: "Bahçe Mobilyaları",
      description: "ŞİMDİ KEŞFET",
      order_index: 2,
      is_active: true,
    },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: {
        id: await prisma.heroSlide
          .findFirst({
            where: { image_url: slide.image_url },
          })
          .then((s) => s?.id || -1),
      },
      update: {},
      create: slide,
    })
  }
  console.log(`Created ${heroSlides.length} hero slides`)

  // Create site settings
  const siteSettings = [
    { key: "site_name", value: "Mobilya Sitesi" },
    { key: "contact_email", value: "info@mobilyasitesi.com" },
    { key: "contact_phone", value: "+90 555 123 4567" },
    { key: "address", value: "Örnek Mahallesi, Örnek Sokak No:1, İstanbul" },
    { key: "whatsapp_number", value: "+905551234567" },
  ]

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log(`Created ${siteSettings.length} site settings`)

  console.log("Database seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
