import type { Metadata } from "next"
import ProductGrid from "@/components/product-grid"
import { getNewProducts } from "@/lib/product-service"

export const metadata: Metadata = {
  title: "Yeni Ürünler | Divona Home",
  description: "En yeni mobilya ve dekorasyon ürünlerimizi keşfedin.",
}

export default async function NewProductsPage() {
  try {
    // Use the new getNewProducts function instead of getFeaturedProducts
    const products = await getNewProducts(24)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Yeni Ürünler</h1>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Şu anda yeni ürün bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error fetching new products:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Yeni Ürünler</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        </div>
      </div>
    )
  }
}
