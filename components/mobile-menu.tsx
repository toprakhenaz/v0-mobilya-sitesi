"use client"

import { useState } from "react"
import Link from "next/link"
import { X, User, ShoppingBag, FileText, Facebook, Instagram, Youtube, Linkedin, Rss } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
// Import the CategoriesMenu component
import CategoriesMenu from "./categories-menu"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [activeTab, setActiveTab] = useState<"main" | "categories" | "info">("main")

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[85vw] p-0">
        <SheetHeader className="border-b p-4 flex flex-row justify-between items-center">
          <SheetTitle className="text-left">Divona Home</SheetTitle>
          <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
            <X className="h-5 w-5" />
          </SheetClose>
        </SheetHeader>

        {activeTab === "main" && (
          <div className="flex flex-col">
            <Link href="/uye-ol" className="flex items-center gap-3 p-4 border-b">
              <User className="h-5 w-5 text-green-500" />
              <span>Üye Ol / Giriş Yap</span>
            </Link>
            <Link href="/sepet" className="flex items-center gap-3 p-4 border-b">
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-green-500" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </div>
              <span>Sepet</span>
            </Link>
            <Link href="/siparis-takibi" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Sipariş Takibi</span>
            </Link>

            <Link href="/proje-urunler" className="p-4 bg-yellow-400 text-center font-medium">
              Proje Ürünler
            </Link>
            <Link href="/garage-sale" className="p-4 bg-green-500 text-white text-center font-medium">
              Garage Sale
            </Link>

            {/* Replace the duplicated categories section with: */}
            <CategoriesMenu mobileView={true} />
          </div>
        )}

        {activeTab === "categories" && (
          <div className="flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-medium mb-2">Bahçe Üçlü Koltuklar</h2>
            </div>
            <Link href="/hakkimizda" className="flex items-center gap-3 p-4 border-b">
              <ShoppingBag className="h-5 w-5 text-green-500" />
              <span>Hakkımızda</span>
            </Link>
            <Link href="/sikca-sorulan-sorular" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Sıkça Sorulan Sorular</span>
            </Link>
            <Link href="/siparis-takibi" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Sipariş Takibi</span>
            </Link>
            <Link href="/iletisim" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>İletişim</span>
            </Link>
            <Link href="/mimarlik-hizmeti" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Mimarlık Hizmeti</span>
            </Link>
            <Link href="/showroomlar" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Showroomlar</span>
            </Link>
            <Link href="/basin" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Basın</span>
            </Link>
            <Link href="/blog" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Blog</span>
            </Link>
            <Link href="/diger" className="flex items-center gap-3 p-4 border-b">
              <FileText className="h-5 w-5 text-green-500" />
              <span>Diğer</span>
            </Link>

            <button onClick={() => setActiveTab("main")} className="p-4 text-green-500 text-center font-medium">
              Geri
            </button>
          </div>
        )}

        {activeTab === "info" && (
          <div className="flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-medium mb-2">Diğer Sayfalar</h2>
            </div>
            <Link href="/hakkimizda" className="p-4 border-b">
              Hakkımızda
            </Link>
            <Link href="/sikca-sorulan-sorular" className="p-4 border-b">
              Sıkça Sorulan Sorular
            </Link>
            <Link href="/iletisim" className="p-4 border-b">
              İletişim
            </Link>
            <Link href="/mimarlik-hizmeti" className="p-4 border-b">
              Mimarlık Hizmeti
            </Link>
            <Link href="/showroomlar" className="p-4 border-b">
              Showroomlar
            </Link>

            <button onClick={() => setActiveTab("main")} className="p-4 text-green-500 text-center font-medium">
              Geri
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 border-t">
          <div className="flex justify-center space-x-4 p-4">
            <Link href="https://facebook.com" className="text-blue-600">
              <Facebook size={20} />
            </Link>
            <Link href="https://instagram.com" className="text-pink-600">
              <Instagram size={20} />
            </Link>
            <Link href="https://youtube.com" className="text-red-600">
              <Youtube size={20} />
            </Link>
            <Link href="https://linkedin.com" className="text-blue-700">
              <Linkedin size={20} />
            </Link>
            <Link href="/rss" className="text-orange-500">
              <Rss size={20} />
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
