"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logoutAction } from "@/app/admin/actions"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("products").select("*").eq("id", params.id).single()

      if (data) {
        setProduct(data)
        setFormData(data)
      }
      setIsLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSaving(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image_url: formData.image_url,
        })
        .eq("id", formData.id)

      if (updateError) throw updateError

      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm("Are you sure you want to delete this product?")) return

    setIsSaving(true)

    try {
      const supabase = createClient()

      const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id)

      if (deleteError) throw deleteError

      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product")
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold">
            Curated Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm hover:text-muted-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm hover:text-muted-foreground transition-colors">
              Products
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-sm hover:text-muted-foreground transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Back to Products
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-8">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Electronics"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving}>
              Delete Product
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
