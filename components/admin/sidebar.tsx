"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// Hero Carousel yönetimi için import ekleyin
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  FileText,
  Settings,
  Users,
  CreditCard,
  Phone,
  LogOut,
  ImageIcon,
} from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  title: string
}

function SidebarItem({ href, icon, title }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
        isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500",
      )}
    >
      {icon}
      {title}
    </Link>
  )
}

export function AdminSidebar() {
  const { logout } = useAdmin()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold">Divona Home Admin</h1>
        </div>
        <div className="flex flex-col flex-1 px-3 mt-6 space-y-1">
          <SidebarItem href="/admin/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} title="Dashboard" />
          <SidebarItem href="/admin/products" icon={<ShoppingBag className="h-5 w-5" />} title="Ürünler" />
          <SidebarItem href="/admin/categories" icon={<Tag className="h-5 w-5" />} title="Kategoriler" />
          <SidebarItem href="/admin/orders" icon={<FileText className="h-5 w-5" />} title="Siparişler" />
          <SidebarItem href="/admin/users" icon={<Users className="h-5 w-5" />} title="Kullanıcılar" />
          <SidebarItem href="/admin/settings" icon={<Settings className="h-5 w-5" />} title="Site Ayarları" />
          <SidebarItem
            href="/admin/payment-settings"
            icon={<CreditCard className="h-5 w-5" />}
            title="Ödeme Ayarları"
          />
          <SidebarItem href="/admin/contact-settings" icon={<Phone className="h-5 w-5" />} title="İletişim Ayarları" />
          {/* SidebarItem listesine Hero Carousel yönetimi için bir öğe ekleyin */}
          {/* Diğer SidebarItem'lardan sonra, <div className="pt-4 mt-4 border-t"> satırından önce aşağıdaki kodu ekleyin: */}
          <SidebarItem href="/admin/hero-carousel" icon={<ImageIcon className="h-5 w-5" />} title="Hero Carousel" />

          <div className="pt-4 mt-4 border-t">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 transition-all hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
