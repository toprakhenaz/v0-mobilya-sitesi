import { MessageCircle } from "lucide-react"

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/902121234567"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors"
      aria-label="WhatsApp Destek"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

export default WhatsAppButton
