"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, MoveUp, MoveDown, ImageIcon, AlertCircle } from "lucide-react"
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  updateHeroSlideOrder,
  type HeroSlide,
} from "@/lib/admin-service"

export default function HeroCarouselPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    subtitle: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  async function fetchSlides() {
    try {
      setLoading(true)
      const data = await getHeroSlides()
      setSlides(data)
    } catch (error) {
      console.error("Hero slaytları alınırken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slaytları alınırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleAddDialogOpen() {
    setFormData({
      image_url: "",
      title: "",
      subtitle: "",
      description: "",
      is_active: true,
    })
    setIsAddDialogOpen(true)
  }

  function handleEditDialogOpen(slide: HeroSlide) {
    setCurrentSlide(slide)
    setFormData({
      image_url: slide.image_url,
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      is_active: slide.is_active,
    })
    setIsEditDialogOpen(true)
  }

  function handleDeleteDialogOpen(slide: HeroSlide) {
    setCurrentSlide(slide)
    setIsDeleteDialogOpen(true)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSwitchChange(checked: boolean) {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  async function handleAddSlide() {
    try {
      const newSlide = await createHeroSlide({
        image_url: formData.image_url,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        is_active: formData.is_active,
        order_index: slides.length, // Yeni slayt en sona eklenir
      })

      if (newSlide) {
        toast({
          title: "Başarılı",
          description: "Hero slayt başarıyla eklendi.",
        })
        setIsAddDialogOpen(false)
        fetchSlides()
      }
    } catch (error) {
      console.error("Hero slayt eklenirken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slayt eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleUpdateSlide() {
    if (!currentSlide) return

    try {
      const updatedSlide = await updateHeroSlide(currentSlide.id, {
        image_url: formData.image_url,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        is_active: formData.is_active,
      })

      if (updatedSlide) {
        toast({
          title: "Başarılı",
          description: "Hero slayt başarıyla güncellendi.",
        })
        setIsEditDialogOpen(false)
        fetchSlides()
      }
    } catch (error) {
      console.error("Hero slayt güncellenirken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slayt güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteSlide() {
    if (!currentSlide) return

    try {
      await deleteHeroSlide(currentSlide.id)
      toast({
        title: "Başarılı",
        description: "Hero slayt başarıyla silindi.",
      })
      setIsDeleteDialogOpen(false)
      fetchSlides()
    } catch (error) {
      console.error("Hero slayt silinirken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slayt silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleMoveSlide(slideId: number, direction: "up" | "down") {
    const slideIndex = slides.findIndex((slide) => slide.id === slideId)
    if (slideIndex === -1) return

    const newSlides = [...slides]

    if (direction === "up" && slideIndex > 0) {
      // Swap with the previous slide
      ;[newSlides[slideIndex], newSlides[slideIndex - 1]] = [newSlides[slideIndex - 1], newSlides[slideIndex]]
    } else if (direction === "down" && slideIndex < newSlides.length - 1) {
      // Swap with the next slide
      ;[newSlides[slideIndex], newSlides[slideIndex + 1]] = [newSlides[slideIndex + 1], newSlides[slideIndex]]
    } else {
      return // No change needed
    }

    // Update order_index for all slides
    const updatedSlides = newSlides.map((slide, index) => ({
      id: slide.id,
      order_index: index,
    }))

    try {
      await updateHeroSlideOrder(updatedSlides)
      fetchSlides()
    } catch (error) {
      console.error("Slayt sırası güncellenirken hata:", error)
      toast({
        title: "Hata",
        description: "Slayt sırası güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Carousel Yönetimi</h1>
          <p className="text-muted-foreground">Ana sayfa hero carousel slaytlarını buradan yönetebilirsiniz.</p>
        </div>
        <Button onClick={handleAddDialogOpen}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Slayt Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Slaytları</CardTitle>
          <CardDescription>Mevcut hero slaytlarını görüntüleyin ve düzenleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Yükleniyor...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-4 flex flex-col items-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Henüz hero slayt bulunmuyor.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddDialogOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Slayt Ekle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="flex items-center border rounded-lg p-4">
                  <div className="relative w-24 h-16 mr-4 rounded overflow-hidden">
                    {slide.image_url ? (
                      <Image
                        src={slide.image_url || "/placeholder.svg"}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{slide.title}</h3>
                      {!slide.is_active && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Pasif</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                    <p className="text-sm">{slide.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleMoveSlide(slide.id, "up")}>
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleMoveSlide(slide.id, "down")}>
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditDialogOpen(slide)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteDialogOpen(slide)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Slide Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Hero Slayt Ekle</DialogTitle>
            <DialogDescription>Ana sayfada gösterilecek yeni bir hero slayt ekleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image_url">Görsel URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">Önerilen boyut: 1920x600 piksel</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="YAZ FIRSATLARI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Alt Başlık</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Bahçe Mobilyalarında"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="%30 İNDİRİM"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddSlide}>Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Slide Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hero Slayt Düzenle</DialogTitle>
            <DialogDescription>Seçili hero slaytı düzenleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_image_url">Görsel URL</Label>
              <Input
                id="edit_image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground">Önerilen boyut: 1920x600 piksel</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_title">Başlık</Label>
              <Input
                id="edit_title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="YAZ FIRSATLARI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_subtitle">Alt Başlık</Label>
              <Input
                id="edit_subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Bahçe Mobilyalarında"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Açıklama</Label>
              <Input
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="%30 İNDİRİM"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit_is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="edit_is_active">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleUpdateSlide}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Slide Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hero Slayt Sil</DialogTitle>
            <DialogDescription>Bu slaytı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>{currentSlide?.title}</strong> başlıklı slayt silinecek.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteSlide}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
