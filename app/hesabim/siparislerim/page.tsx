"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Package, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { AccountSidebar } from "@/components/sidebar"
import { MobileAccountSidebar } from "@/components/mobile-account-sidebar"

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push("/giris-yap?redirect=/hesabim/siparislerim")
        return
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items:order_items(
              *,
              product:products(*)
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setOrders(data || [])
      } catch (error) {
        console.error("Siparişler yüklenirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "shipped":
        return <Package className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Beklemede"
      case "paid":
        return "Ödendi"
      case "shipped":
        return "Kargoya Verildi"
      case "delivered":
        return "Teslim Edildi"
      case "cancelled":
        return "İptal Edildi"
      default:
        return "Bilinmiyor"
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Account Sidebar */}
        <MobileAccountSidebar />

        {/* Desktop Sidebar - Account Navigation */}
        <div className="w-full md:w-64 shrink-0 hidden md:block">
          <AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-xl font-bold mb-6">Siparişlerim</h1>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Sipariş No</p>
                        <p className="font-medium">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tarih</p>
                        <p className="font-medium">{new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Toplam</p>
                        <p className="font-medium">{order.total_amount.toLocaleString("tr-TR")} ₺</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Durum</p>
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link href={`/hesabim/siparislerim/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Detayları Görüntüle
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Sipariş bulunamadı</h3>
                <p className="text-gray-500 mb-6">Henüz bir sipariş vermemiş görünüyorsunuz.</p>
                <Link href="/">
                  <Button>Alışverişe Başla</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
