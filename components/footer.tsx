"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Shield, CreditCard, Truck, Award } from "lucide-react"
import Logo from "./logo"

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="bg-white">
      {/* Trust Badges */}
      <div className="border-t border-b py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center md:justify-start">
              <Shield className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="font-semibold text-sm">Güvenli Alışveriş</h4>
                <p className="text-xs text-gray-500">256-bit SSL Güvenliği</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <CreditCard className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="font-semibold text-sm">Güvenli Ödeme</h4>
                <p className="text-xs text-gray-500">Tüm Kredi Kartları</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Truck className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="font-semibold text-sm">Hızlı Teslimat</h4>
                <p className="text-xs text-gray-500">Tüm Türkiye'ye</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Award className="h-8 w-8 text-primary mr-3" />
              <div>
                <h4 className="font-semibold text-sm">Kalite Garantisi</h4>
                <p className="text-xs text-gray-500">2 Yıl Garanti</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve İletişim */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <Logo size="medium" className="mb-4" />
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Divona Home, bahçe mobilyaları ve dış mekan dekorasyonu konusunda Türkiye'nin önde gelen markasıdır.
              Kaliteli ve şık ürünlerimizle bahçenizi güzelleştiriyoruz.
            </p>

            {/* İletişim Bilgileri - Mobil ve Desktop */}
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
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
                    className="text-primary"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Müşteri Hizmetleri</h4>
                  <p>0 850 305 86 07</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 ml-12">İmişehir OSB 2001 Cadde No:16 Odunpazarı / ESKİŞEHİR</p>
            </div>

            {/* Sosyal Medya - Mobil ve Desktop */}
            <div className="flex space-x-3 mt-4">
              <Link
                href="https://facebook.com"
                className="bg-blue-600 text-white rounded-full p-2 hover:opacity-80 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </Link>
              <Link
                href="https://instagram.com"
                className="bg-pink-600 text-white rounded-full p-2 hover:opacity-80 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
              <Link
                href="https://youtube.com"
                className="bg-red-600 text-white rounded-full p-2 hover:opacity-80 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                className="bg-blue-700 text-white rounded-full p-2 hover:opacity-80 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </Link>
            </div>
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
              <li>
                <Link href="/sikca-sorulan-sorular" className="text-gray-600 hover:text-primary">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/magaza-konumlari" className="text-gray-600 hover:text-primary">
                  Mağaza Konumları
                </Link>
              </li>
            </ul>
          </div>

          {/* Hesabım */}
          <div>
            <h3 className="font-semibold mb-4">Hesabım</h3>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li>
                    <Link href="/hesabim" className="text-gray-600 hover:text-primary">
                      Hesabım
                    </Link>
                  </li>
                  <li>
                    <Link href="/hesabim/siparislerim" className="text-gray-600 hover:text-primary">
                      Siparişlerim
                    </Link>
                  </li>
                  <li>
                    <Link href="/hesabim/favorilerim" className="text-gray-600 hover:text-primary">
                      Favorilerim
                    </Link>
                  </li>
                  <li>
                    <Link href="/hesabim/adreslerim" className="text-gray-600 hover:text-primary">
                      Adreslerim
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/giris-yap" className="text-gray-600 hover:text-primary">
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link href="/uye-ol" className="text-gray-600 hover:text-primary">
                      Üye Ol
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link href="/siparis-takibi" className="text-gray-600 hover:text-primary">
                  Sipariş Takibi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* International Shipping Flags */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="font-bold mb-4 text-center">Uluslararası Gönderim</h3>
          <div className="flex flex-wrap justify-center gap-6 items-center mb-6">
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/turkey-flag.png"
                alt="Türkiye"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/germany-flag.png"
                alt="Almanya"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/france-flag.png"
                alt="Fransa"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/ukraine-flag.png"
                alt="Ukrayna"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/belgium-flag.png"
                alt="Belçika"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/usa-flag.png"
                alt="ABD"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Divona Home. Tüm hakları saklıdır.
            </p>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href="https://etbis.gov.tr" target="_blank" rel="noopener noreferrer" className="mr-4">
                <Image src="/etbis-qr.png" alt="ETBIS" width={100} height={100} className="object-contain" />
              </Link>
              <div>
                <p className="text-xs text-gray-500">ETBIS - E-Ticaret Bilgi Sistemi</p>
                <p className="text-xs text-gray-500 font-bold">ETBİS'e Kayıtlıdır</p>
                <p className="text-xs text-gray-500">Güvenli E-Ticaret</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/ssl-sertifikasi" className="text-xs text-gray-500 hover:underline">
                SSL Sertifikası
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/guvenli-alisveris" className="text-xs text-gray-500 hover:underline">
                Güvenli Alışveriş
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/kvkk" className="text-xs text-gray-500 hover:underline">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
        <div className="grid grid-cols-4">
          <Link href="/" className="flex flex-col items-center justify-center p-2">
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
              className="mb-1"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs">Ana Sayfa</span>
          </Link>
          <Link href="/kategoriler" className="flex flex-col items-center justify-center p-2">
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
              className="mb-1"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span className="text-xs">Kategoriler</span>
          </Link>
          <Link href="/hesabim/siparislerim" className="flex flex-col items-center justify-center p-2">
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
              className="mb-1"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className="text-xs">Siparişlerim</span>
          </Link>
          <Link href="/sepet" className="flex flex-col items-center justify-center p-2">
            <div className="relative">
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
                className="mb-1"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </div>
            <span className="text-xs">Sepet</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
