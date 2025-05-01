"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Shield, CreditCard, Truck, Award } from "lucide-react"

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
          {/* Logo ve Açıklama */}
          <div className="md:col-span-1">
            <Link href="/" className="block mb-4">
              <Logo size="medium" />
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
              <li>
                <Link href="/siparis-takibi" className="text-gray-600 hover:text-primary">
                  Sipariş Takibi
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

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">© 2023 Divona Home. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {/* SVG Visa logo */}
              <div className="h-10 w-20">
                <VisaLogo />
              </div>

              {/* SVG Mastercard logo */}
              <div className="h-10 w-20">
                <MastercardLogo />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href="https://etbis.gov.tr" target="_blank" rel="noopener noreferrer" className="mr-4">
                {/* ETBIS logo */}
                <div className="h-16 w-16 relative">
                  <Image src="/etbis-qr.jpeg" alt="ETBIS" fill className="object-contain" />
                </div>
              </Link>
              <div>
                <p className="text-xs text-gray-500">ETBIS - E-Ticaret Bilgi Sistemi</p>
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
    </footer>
  )
}

// SVG Visa Logo Component
function VisaLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 324" className="w-full h-full">
      <path
        fill="#00579F"
        d="M651.3,0.5h-99.4c-27.7,0-48.3,7.5-60.5,35.2L386.7,323.4h99.7c0,0,12.4-32.7,15.2-39.9c8.3,0,82.2,0.1,92.7,0.1
        c2.2,9.3,8.7,39.8,8.7,39.8h88.1L651.3,0.5z M533.5,220.6c6-15.3,28.8-74.3,28.8-74.3c-0.4,0.7,5.9-15.4,9.6-25.4l4.9,22.8
        c0,0,13.8,63.3,16.7,76.8C575.8,220.6,549.3,220.6,533.5,220.6z"
      />
      <path
        fill="#00579F"
        d="M355.7,0.5l-93.2,236.7l-10-49.9c-17.4-56.1-71.8-116.9-132.7-147.1l85.9,282.8l101.6-0.1L434.3,0.5H355.7z"
      />
      <path
        fill="#FAA61A"
        d="M197.8,0.5H0.5L0,8.2c152.2,36.8,253,125.7,294.7,232.4L252.2,35.7C245.3,13.1,224.7,1.4,197.8,0.5z"
      />
      <path
        fill="#00579F"
        d="M937.1,0.5h-77.9c-17.7,0-31,4.8-38.8,22.4l-123.3,300.5h99.5c0,0,14.3-37.7,17.5-46c9.5,0,95.7,0,107.9,0
        c2.5,10.7,10.1,46,10.1,46h87.9L937.1,0.5z M842.4,220.6c7-17.8,33.6-86.3,33.6-86.3c-0.5,0.8,6.9-17.9,11.2-29.6l5.7,26.6
        c0,0,16.1,73.8,19.5,89.3C890.9,220.6,860.1,220.6,842.4,220.6z"
      />
    </svg>
  )
}

// SVG Mastercard Logo Component
function MastercardLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 131.39 86.9" className="w-full h-full">
      <path d="M48.37,15.14h34.66V72.31H48.37Z" fill="#ff5f00" />
      <path
        d="M51.94,43.72a36.47,36.47,0,0,1,13.75-28.58,36.37,36.37,0,0,0-45.15,5.72,36.4,36.4,0,0,0-8.24,39.8,36.38,36.38,0,0,0,53.39,11.49,36.41,36.41,0,0,1-13.75-28.43Z"
        fill="#eb001b"
      />
      <path
        d="M120.5,65.76V64.93h.29v-.15h-.74v.15h.29v.83Zm1.48,0v-1h-.23l-.26.71-.26-.71h-.23v1h.16V65l.24.68h.17L121.82,65v.74Z"
        fill="#f79e1b"
      />
      <path
        d="M123.94,43.72a36.42,36.42,0,0,1-59.25,28.43,36.38,36.38,0,0,0,0-56.86,36.42,36.42,0,0,1,59.25,28.43Z"
        fill="#f79e1b"
      />
    </svg>
  )
}
