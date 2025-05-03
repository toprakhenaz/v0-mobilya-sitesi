import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { getSiteSettings } from "@/lib/admin-service"

export default async function Contact() {
  // Site ayarlarını getir
  const settings = await getSiteSettings()

  // Ayarları bir objeye dönüştür
  const settingsObj: Record<string, string> = {}
  settings.forEach((setting) => {
    settingsObj[setting.key] = setting.value
  })

  // İletişim bilgileri
  const phone = settingsObj.phone || settingsObj.telefon_numarasi || "+90 212 123 45 67"
  const email = settingsObj.email || "info@divonahome.com"
  const address =
    settingsObj.address ||
    settingsObj.adres ||
    "Merkez: İstanbul, Türkiye\nShowroom: Bağdat Caddesi No:123, Kadıköy, İstanbul"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">İletişim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Bize Ulaşın</h2>
            <p className="text-gray-600 mb-6">
              Sorularınız, önerileriniz veya şikayetleriniz için aşağıdaki formu doldurarak bize ulaşabilirsiniz.
            </p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Adınız Soyadınız
                  </label>
                  <Input id="name" placeholder="Adınız Soyadınız" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-posta Adresiniz
                  </label>
                  <Input id="email" type="email" placeholder="E-posta Adresiniz" required />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Telefon Numaranız
                </label>
                <Input id="phone" placeholder="Telefon Numaranız" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Konu
                </label>
                <Input id="subject" placeholder="Konu" required />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mesajınız
                </label>
                <Textarea id="message" placeholder="Mesajınız" rows={5} required />
              </div>

              <Button type="submit" className="w-full">
                Gönder
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">İletişim Bilgileri</h2>

            <div className="space-y-4">
              <div className="flex">
                <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Adres</h3>
                  <p className="text-gray-600 whitespace-pre-line">{address}</p>
                </div>
              </div>

              <div className="flex">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Telefon</h3>
                  <p className="text-gray-600">{phone}</p>
                </div>
              </div>

              <div className="flex">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">E-posta</h3>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>

              <div className="flex">
                <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Çalışma Saatleri</h3>
                  <p className="text-gray-600">
                    Pazartesi - Cumartesi: 09:00 - 19:00
                    <br />
                    Pazar: 10:00 - 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Konum</h2>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192698.6596245466!2d28.8720964!3d41.0053215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1651234567890!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
