"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSiteSettings } from "@/lib/admin-service"

interface SiteSettingsContextType {
  settings: Record<string, string>
  loading: boolean
  getSetting: (key: string) => string
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings()
        const settingsObj: Record<string, string> = {}

        data.forEach((setting) => {
          settingsObj[setting.key] = setting.value
        })

        setSettings(settingsObj)
      } catch (error) {
        console.error("Site ayarları alınırken hata oluştu:", error)
        // Hata durumunda boş bir nesne ile devam et
        setSettings({})
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const getSetting = (key: string): string => {
    return settings[key] || ""
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, getSetting }}>{children}</SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
