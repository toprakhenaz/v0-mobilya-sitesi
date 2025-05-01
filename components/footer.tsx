import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <Image src="/logo.png" alt="Divona Home" width={150} height={50} />
            </Link>
            <p className="text-gray-600 text-sm">
              Divona Home, bahçe mobilyaları ve dış mekan dekorasyonu konusunda Türkiye'nin önde gelen markasıdır.
              Kaliteli ve şık ürünlerimizle bahçenizi güzelleştiriyoruz.
            </p>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="font-bold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bahce-oturma-grubu" className="text-gray-600 hover:text-primary">
                  Bahçe Oturma Grubu
                </Link>
              </li>
              <li>
                <Link href="/kategori/bahce-kose-takimi" className="text-gray-600 hover:text-primary">
                  Bahçe Köşe Takımı
                </Link>
              </li>
              <li>
                <Link href="/kategori/masa-takimi" className="text-gray-600 hover:text-primary">
                  Masa Takımı
                </Link>
              </li>
              <li>
                <Link href="/kategori/sezlong" className="text-gray-600 hover:text-primary">
                  Şezlong
                </Link>
              </li>
              <li>
                <Link href="/kategori/sandalye" className="text-gray-600 hover:text-primary">
                  Sandalye
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-bold mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-primary">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-primary">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-gray-600 hover:text-primary">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="text-gray-600 hover:text-primary">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/iade-kosullari" className="text-gray-600 hover:text-primary">
                  İade Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">📍</span>
                <span className="text-gray-600">Örnek Mah. Bahçe Cad. No:123 Ataşehir/İstanbul</span>
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">📞</span>
                <span className="text-gray-600">0850 123 45 67</span>
              </li>
              <li className="flex items-center">
                <span className="text-primary mr-2">✉️</span>
                <span className="text-gray-600">info@divonahome.com</span>
              </li>
              <li className="mt-4">
                <Link href="/siparis-takibi" className="text-primary hover:underline">
                  Sipariş Takibi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">© 2023 Divona Home. Tüm hakları saklıdır.</p>
            <div className="flex space-x-4">
              <Image src="/visa-logo.png" alt="Visa" width={40} height={25} />
              <Image src="/mastercard-logo.png" alt="Mastercard" width={40} height={25} />
              <Image src="/troy-logo.png" alt="Troy" width={40} height={25} />
              <Image src="/american-express-logo.png" alt="American Express" width={40} height={25} />
              <Image src="/iyzico-logo.png" alt="iyzico" width={40} height={25} />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="https://etbis.gov.tr" target="_blank" rel="noopener noreferrer">
              <Image src="/etbis-qr.png" alt="ETBIS" width={80} height={80} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
