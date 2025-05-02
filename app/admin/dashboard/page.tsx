"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Tag, FileText, Users, ArrowRight, Settings, CreditCard, Phone } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productCount: 0,
    categoryCount: 0,
    orderCount: 0,
    userCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Ürün sayısı
        const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

        // Kategori sayısı
        const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

        // Sipariş sayısı
        const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

        // Kullanıcı sayısı
        const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

        setStats({
          productCount: productCount || 0,
          categoryCount: categoryCount || 0,
          orderCount: orderCount || 0,
          userCount: userCount || 0,
        })
      } catch (error) {
        console.error("İstatistikler alınırken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Sitenizin genel durumunu buradan takip edebilirsiniz.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.productCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/products" className="flex items-center hover:underline">
                Ürünleri Yönet
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kategori</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.categoryCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/categories" className="flex items-center hover:underline">
                Kategorileri Yönet
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.orderCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/orders" className="flex items-center hover:underline">
                Siparişleri Yönet
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/admin/users" className="flex items-center hover:underline">
                Kullanıcıları Yönet
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="recent">Son Siparişler</TabsTrigger>
          <TabsTrigger value="settings">Hızlı Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genel Bakış</CardTitle>
              <CardDescription>Sitenizin genel durumu ve önemli istatistikler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aylık Ziyaretçi</span>
                    <span className="text-sm text-muted-foreground">1,245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aylık Satış</span>
                    <span className="text-sm text-muted-foreground">32</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ortalama Sepet Tutarı</span>
                    <span className="text-sm text-muted-foreground">₺2,450</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stokta Olmayan Ürünler</span>
                    <span className="text-sm text-muted-foreground">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bekleyen Siparişler</span>
                    <span className="text-sm text-muted-foreground">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Toplam Gelir (Bu Ay)</span>
                    <span className="text-sm text-muted-foreground">₺78,400</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Siparişler</CardTitle>
              <CardDescription>Son 5 sipariş</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">#1234</p>
                    <p className="text-sm text-muted-foreground">Ahmet Yılmaz</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₺1,250</p>
                    <p className="text-sm text-muted-foreground">2 ürün</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">#1233</p>
                    <p className="text-sm text-muted-foreground">Ayşe Demir</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₺3,450</p>
                    <p className="text-sm text-muted-foreground">4 ürün</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">#1232</p>
                    <p className="text-sm text-muted-foreground">Mehmet Kaya</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₺2,100</p>
                    <p className="text-sm text-muted-foreground">3 ürün</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Ayarlar</CardTitle>
              <CardDescription>Sık kullanılan ayarlara hızlı erişim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/admin/settings" className="flex items-center p-3 rounded-lg border hover:bg-gray-50">
                  <Settings className="h-5 w-5 mr-2" />
                  <span>Site Ayarları</span>
                </Link>
                <Link
                  href="/admin/payment-settings"
                  className="flex items-center p-3 rounded-lg border hover:bg-gray-50"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span>Ödeme Ayarları</span>
                </Link>
                <Link
                  href="/admin/contact-settings"
                  className="flex items-center p-3 rounded-lg border hover:bg-gray-50"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span>İletişim Ayarları</span>
                </Link>
                <Link href="/admin/products" className="flex items-center p-3 rounded-lg border hover:bg-gray-50">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  <span>Ürün Yönetimi</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
