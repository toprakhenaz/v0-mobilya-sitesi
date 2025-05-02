"use client"
import Link from "next/link"
import { FileText, Heart, MapPin, Settings, User, Package, Star } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function AccountSidebar() {
  return (
    <SidebarProvider>
      <Sidebar className="hidden md:flex">
        <SidebarHeader>
          <div className="p-2">
            <h2 className="text-lg font-bold">Hesabım</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/hesabim/siparislerim">
                      <FileText className="h-5 w-5 mr-2" />
                      <span>Siparişlerim</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/hesabim/kuponlarim">
                      <FileText className="h-5 w-5 mr-2" />
                      <span>Kuponlarım</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/hesabim/adreslerim">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>Adreslerim</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/hesabim/favorilerim">
                      <Heart className="h-5 w-5 mr-2" />
                      <span>Favorilerim</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/siparis-takibi">
                      <Package className="h-5 w-5 mr-2" />
                      <span>Sipariş Takibi</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/yeni-urunler">
                      <Star className="h-5 w-5 mr-2" />
                      <span>Yeni Ürünler</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/hesabim/hesap-ayarlari">
                      <Settings className="h-5 w-5 mr-2" />
                      <span>Hesap Ayarları</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/cikis-yap">
                      <User className="h-5 w-5 mr-2" />
                      <span>Çıkış Yap</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
