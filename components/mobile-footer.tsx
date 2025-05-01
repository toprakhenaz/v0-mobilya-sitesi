import Link from "next/link"
import { Home, Grid3X3, FileText, ShoppingCart } from "lucide-react"

const MobileFooter = () => {
  return (
    <>
      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
        <div className="grid grid-cols-4">
          <Link href="/" className="flex flex-col items-center justify-center p-2">
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Ana Sayfa</span>
          </Link>
          <Link href="/kategoriler" className="flex flex-col items-center justify-center p-2">
            <Grid3X3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Kategoriler</span>
          </Link>
          <Link href="/siparislerim" className="flex flex-col items-center justify-center p-2">
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">Siparişlerim</span>
          </Link>
          <Link href="/sepet" className="flex flex-col items-center justify-center p-2">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 mb-1" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </div>
            <span className="text-xs">Sepet</span>
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <footer className="bg-gray-900 text-white pt-6 pb-24 md:pb-6">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">İletişim bilgileri</h3>
            <div className="flex items-center mb-2">
              <div className="bg-green-500 rounded-full p-2 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Müşteri Hizmetleri</h4>
                <p>0 850 305 86 07</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 ml-12">İmişehir OSB 2001 Cadde No:16 Odunpazarı / ESKİŞEHİR</p>
          </div>

          <div className="flex justify-center space-x-3 mb-6">
            <Link href="https://facebook.com" className="bg-blue-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
              </svg>
            </Link>
            <Link href="https://instagram.com" className="bg-pink-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </Link>
            <Link href="https://youtube.com" className="bg-red-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </Link>
            <Link href="https://linkedin.com" className="bg-blue-700 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </Link>
            <Link href="/rss" className="bg-orange-500 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
              </svg>
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Öne Çıkan Kategoriler</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/bahce-mobilyasi" className="text-sm text-gray-300 hover:text-white">
                Bahçe Mobilyası
              </Link>
              <Link href="/bahce-oturma-grubu" className="text-sm text-gray-300 hover:text-white">
                Bahçe Oturma Grubu
              </Link>
              <Link href="/bahce-kose-takimi" className="text-sm text-gray-300 hover:text-white">
                Bahçe Köşe Takımı
              </Link>
              <Link href="/masa-takimi" className="text-sm text-gray-300 hover:text-white">
                Masa Takımı
              </Link>
              <Link href="/masa" className="text-sm text-gray-300 hover:text-white">
                Masa
              </Link>
              <Link href="/sandalye" className="text-sm text-gray-300 hover:text-white">
                Sandalye
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} Divona Home. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default MobileFooter
