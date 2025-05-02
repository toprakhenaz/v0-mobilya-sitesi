"use client"

import { useSiteSettings } from "@/components/admin/site-settings-provider"
import { MessageCircle } from "lucide-react"

export default function WhatsappButton() {
  const { getSetting } = useSiteSettings()

  const whatsappNumber = getSetting("whatsapp_number")
  const whatsappMessage = getSetting("whatsapp_message")

  if (!whatsappNumber) return null

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
      aria-label="WhatsApp ile İletişime Geç"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
