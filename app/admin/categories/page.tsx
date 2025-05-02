"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { type Category, getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/admin-service"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Yeni kategori ekleme/düzenleme state'leri
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image_url: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [searchTerm])

  async function fetchCategories() {
    setLoading(true)
    try {
      const categoriesData = await getCategories(searchTerm)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Kategoriler alınırken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategoriler alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleDeleteClick = (categoryId: number) => {
    setDeleteCategoryId(categoryId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryId) return

    setIsDeleting(true)
    try {
      await deleteCategory(deleteCategoryId)

      // Kategori listesini güncelle
      setCategories(categories.filter((category) => category.id !== deleteCategoryId))

      toast({
        title: "Başarılı",
        description: "Kategori başarıyla silindi.",
      })
    } catch (error) {
      console.error("Kategori silinirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu. Bu kategoriye ait ürünler olabilir.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteCategoryId(null)
    }
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    })
    setIsEditing(true)
    setIsAddDialogOpen(true)
  }

  const handleAddNewClick = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: "",
      description: "",
      image_url: "",
    })
    setIsEditing(false)
    setIsAddDialogOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEditing && editingCategory) {
        // Kategoriyi güncelle
        const updatedCategory = await updateCategory(editingCategory.id, {
          name: categoryForm.name,
          description: categoryForm.description || null,
          image_url: categoryForm.image_url || null,
        })

        if (updatedCategory) {
          // Kategori listesini güncelle
          setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...updatedCategory } : cat)))
        }

        toast({
          title: "Başarılı",
          description: "Kategori başarıyla güncellendi.",
        })
      } else {
        // Slug oluştur
        const slug = categoryForm.name
          .toLowerCase()
          .replace(/[^a-z0-9ğüşıöç]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")

        // Yeni kategori ekle
        const newCategory = await createCategory({
          name: categoryForm.name,
          slug,
          description: categoryForm.description || null,
          image_url: categoryForm.image_url || null,
        })

        if (newCategory) {
          // Kategori listesini güncelle
          setCategories([...categories, { ...newCategory, product_count: 0 }])
        }

        toast({
          title: "Başarılı",
          description: "Kategori başarıyla eklendi.",
        })
      }

      // Formu kapat
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Kategori kaydedilirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategori kaydedilirken bir hata oluştu.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kategoriler</h1>
          <p className="text-muted-foreground">Tüm kategorilerinizi buradan yönetebilirsiniz.</p>
        </div>
        <Button onClick={handleAddNewClick}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Kategori Adı</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Ürün Sayısı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Henüz kategori bulunmuyor."}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right">{category.product_count}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Düzenle</span>
                        </DropdownMenuItem>
                        <Link href={`/kategori/${category.slug}`} target="_blank">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Görüntüle</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDeleteClick(category.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Sil</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyi Sil</DialogTitle>
            <DialogDescription>
              Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Kategori bilgilerini düzenleyin."
                : "Yeni bir kategori eklemek için aşağıdaki formu doldurun."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kategori Adı</Label>
                <Input
                  id="name"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleFormChange}
                  placeholder="Örn: Bahçe Mobilyaları"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={categoryForm.description}
                  onChange={handleFormChange}
                  placeholder="Kategori açıklaması (isteğe bağlı)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Resim URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={categoryForm.image_url}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                İptal
              </Button>
              <Button type="submit" disabled={isSaving || !categoryForm.name.trim()}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor
                  </>
                ) : isEditing ? (
                  "Güncelle"
                ) : (
                  "Ekle"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
