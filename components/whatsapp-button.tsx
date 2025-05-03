"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { useSiteSettings } from "@/contexts/site-settings-context"

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { getSetting } = useSiteSettings()

  // WhatsApp ayarları
  const whatsappNumber = getSetting("whatsapp_number") || getSetting("whatsapp_numarasi") || "905301234567"
  const defaultMessage =
    getSetting("whatsapp_message") || getSetting("varsayilan_mesaj") || "Merhaba, bilgi almak istiyorum."

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage)
    const formattedNumber = whatsappNumber.startsWith("+") ? whatsappNumber.substring(1) : whatsappNumber
    window.open(`https://wa.me/${formattedNumber}?text=${encodedMessage}`, "_blank")
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300"
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-lg w-64 mb-2">
          <h3 className="font-bold text-gray-800 mb-2">WhatsApp ile İletişim</h3>
          <p className="text-sm text-gray-600 mb-3">Sorularınız için hemen mesaj gönderin.</p>
          <button
            onClick={handleWhatsAppClick}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full flex items-center justify-center"
          >
            <MessageCircle size={18} className="mr-2" />
            WhatsApp'ta Mesaj Gönder
          </button>
        </div>
      )}
    </div>
  )
}
