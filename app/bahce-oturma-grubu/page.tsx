import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Sample data
const products = [
  {
    id: 1,
    name: "Pisa Bistro Rattan Bahçe Balkon Oturma Grubu",
    imageUrl: "/pisa-bistro-rattan.png",
    price: 16900.0,
    slug: "pisa-bistro-rattan-bahce-balkon-oturma-grubu",
    discountInCart: 0,
  },
  {
    id: 2,
    name: "Space Bahçe Oturma Grubu (2+1+1+S)",
    imageUrl: "/space-garden-furniture.png",
    originalPrice: 28500.0,
    price: 19990.0,
    slug: "space-bahce-oturma-grubu",
    discountInCart: 29,
  },
  {
    id: 3,
    name: "Pisa İkili Rattan Bahçe Balkon Oturma Grubu",
    imageUrl: "/pisa-ikili-rattan.png",
    price: 21490.0,
    slug: "pisa-ikili-rattan-bahce-balkon-oturma-grubu",
    discountInCart: 0,
  },
  {
    id: 4,
    name: "Palm Alüminyum Rattan 2+1+1+S Bahçe Balkon Oturma Grubu - Krem",
    imageUrl: "/palm-aluminum-rattan.png",
    originalPrice: 30100.0,
    price: 21900.0,
    slug: "palm-aluminyum-rattan-bahce-balkon-oturma-grubu",
    discountInCart: 27,
  },
  {
    id: 5,
    name: "Efes Midi Bahçe Oturma Grubu (3+1+1+S)",
    imageUrl: "/efes-midi-garden-set.png",
    originalPrice: 55900.0,
    price: 37490.0,
    slug: "efes-midi-bahce-oturma-grubu",
    discountInCart: 0,
  },
  {
    id: 6,
    name: "Aura Rattan Bahçe Oturma Grubu (2+1+1+S)",
    imageUrl: "/placeholder.svg?height=300&width=300&query=aura rattan garden set",
    price: 38490.0,
    slug: "aura-rattan-bahce-oturma-grubu",
    discountInCart: 0,
  },
  {
    id: 7,
    name: "Calista Rattan Bahçe Oturma Grubu - Krem (Bamboo Dekoratif Masaüstü Şömine HEDİYELİ!!!)",
    imageUrl: "/placeholder.svg?height=300&width=300&query=calista rattan garden set",
    originalPrice: 46200.0,
    price: 38900.0,
    slug: "calista-rattan-bahce-oturma-grubu",
    discountInCart: 24,
  },
  {
    id: 8,
    name: "Linda Rattan Bahçe Oturma Grubu (3+1+1+S) (Bamboo Dekoratif Masaüstü Şömine HEDİYELİ!!!)",
    imageUrl: "/placeholder.svg?height=300&width=300&query=linda rattan garden set",
    originalPrice: 50900.0,
    price: 38900.0,
    slug: "linda-rattan-bahce-oturma-grubu",
    discountInCart: 28,
  },
]

export default function BahceOturmaGrubu() {
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-green-500">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href="/urunler" className="hover:text-green-500">
            Ürünler
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Bahçe Oturma Grubu</span>
        </div>
      </div>

      {/* Category Title */}
      <div className="bg-gray-100 py-4 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">Bahçe Oturma Grubu</h1>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Sort */}
        <div className="md:hidden mb-4">
          <button className="w-full flex items-center justify-between border rounded-md p-3">
            <span>Sırala</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Sidebar (Desktop only) */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-bold text-lg mb-4">Filtreler</h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>0 - 20.000 ₺</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>20.000 - 30.000 ₺</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>30.000 - 40.000 ₺</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>40.000 ₺ ve üzeri</span>
                  </label>
                </div>
              </div>

              {/* Material */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Malzeme</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>Rattan</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>Ahşap</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>Alüminyum</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-green-500 focus:ring-green-500 mr-2" />
                    <span>Plastik</span>
                  </label>
                </div>
              </div>

              {/* Color */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Renk</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="w-6 h-6 rounded-full bg-black border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-white border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-gray-500 border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-amber-800 border border-gray-300"></button>
                  <button className="w-6 h-6 rounded-full bg-green-500 border border-gray-300"></button>
                </div>
              </div>

              {/* Apply Filters Button */}
              <Button className="w-full bg-green-500 hover:bg-green-600">Filtrele</Button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort Options (Desktop) */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-500">{products.length} ürün bulundu</p>
              <select className="border rounded p-2 text-sm">
                <option>Önerilen Sıralama</option>
                <option>Fiyat: Düşükten Yükseğe</option>
                <option>Fiyat: Yüksekten Düşüğe</option>
                <option>En Yeniler</option>
                <option>En Çok Satanlar</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    {/* Product Image */}
                    <Link href={`/urun/${product.slug}`}>
                      <div className="relative h-48 md:h-64 w-full">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Discount Badge */}
                    {product.discountInCart > 0 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Sepette %{product.discountInCart}
                      </div>
                    )}

                    {/* View Product Button */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 px-3 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <Button className="w-full bg-green-500 hover:bg-green-600">Ürünü İncele</Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="mt-3">
                    <Link href={`/urun/${product.slug}`} className="block">
                      <h3 className="text-sm font-medium line-clamp-2 hover:text-green-500 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-1 flex items-center">
                      {product.originalPrice ? (
                        <>
                          <span className="text-lg font-bold text-green-500">
                            {product.price.toLocaleString("tr-TR")} ₺
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {product.originalPrice.toLocaleString("tr-TR")} ₺
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">{product.price.toLocaleString("tr-TR")} ₺</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
