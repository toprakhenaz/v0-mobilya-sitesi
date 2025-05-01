import Link from "next/link"
import { Home, Grid, ShoppingBag, User } from "lucide-react"

const MobileNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="flex flex-col items-center justify-center p-3">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Ana Sayfa</span>
        </Link>
        <Link href="/kategoriler" className="flex flex-col items-center justify-center p-3">
          <Grid className="h-5 w-5 mb-1" />
          <span className="text-xs">Kategoriler</span>
        </Link>
        <Link href="/sepet" className="flex flex-col items-center justify-center p-3">
          <div className="relative">
            <ShoppingBag className="h-5 w-5 mb-1" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </div>
          <span className="text-xs">Sepetim</span>
        </Link>
        <Link href="/hesabim" className="flex flex-col items-center justify-center p-3">
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Hesabım</span>
        </Link>
      </div>
    </div>
  )
}

export default MobileNav
