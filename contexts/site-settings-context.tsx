"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSiteSettings } from "@/lib/admin-service"

type SiteSettingsContextType = {
  settings: Record<string, string>
  getSetting: (key: string) => string
  isLoading: boolean
  error: string | null
}

const defaultSettings: Record<string, string> = {
  site_name: "Mobilya Sitesi",
  site_description: "Kaliteli mobilya ürünleri",
  contact_email: "info@mobilyasitesi.com",
  contact_phone: "+90 555 123 4567",
  address: "İstanbul, Türkiye",
  shipping_fee: "50",
  free_shipping_threshold: "1000",
  whatsapp_number: "+90 555 123 4567",
  whatsapp_message: "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.",
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  getSetting: () => "",
  isLoading: true,
  error: null,
})

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings()
        const settingsObj: Record<string, string> = { ...defaultSettings }

        data.forEach((setting) => {
          settingsObj[setting.key] = setting.value
        })

        setSettings(settingsObj)
        setError(null)
      } catch (error) {
        console.error("Site ayarları alınırken hata:", error)
        setError("Site ayarları yüklenirken bir hata oluştu. Varsayılan ayarlar kullanılıyor.")
        // Keep using default settings
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const getSetting = (key: string): string => {
    // Eğer doğrudan key ile bulunamazsa, alternatif keyleri kontrol et
    if (settings[key]) return settings[key]

    // Türkçe-İngilizce anahtar eşleştirmeleri
    const keyMappings: Record<string, string[]> = {
      shipping_fee: ["kargo_ucreti"],
      free_shipping_threshold: ["ucretsiz_kargo_esigi"],
      about_short: ["kisa_bilgi"],
      phone: ["telefon_numarasi"],
      address: ["adres"],
      bank_name: ["banka_adi"],
      account_holder: ["hesap_sahibi"],
      whatsapp_number: ["whatsapp_numarasi"],
      whatsapp_message: ["varsayilan_mesaj"],
    }

    // Eşleşen alternatif anahtarları kontrol et
    if (keyMappings[key]) {
      for (const altKey of keyMappings[key]) {
        if (settings[altKey]) return settings[altKey]
      }
    }

    // Tersine eşleştirme
    for (const [mainKey, altKeys] of Object.entries(keyMappings)) {
      if (altKeys.includes(key) && settings[mainKey]) {
        return settings[mainKey]
      }
    }

    // Varsayılan değerleri kontrol et
    if (defaultSettings[key]) return defaultSettings[key]

    return ""
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, getSetting, isLoading, error }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
