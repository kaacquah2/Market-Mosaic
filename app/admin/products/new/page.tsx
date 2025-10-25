"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { logoutAction, createProductWithImage } from "@/app/admin/actions"
import { Upload, Image as ImageIcon, X } from "lucide-react"

const categories = [
  "Electronics",
  "Fashion",
  "Food & Beverages",
  "Kitchen",
  "Home & Garden",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Office Supplies",
  "Books & Media",
  "Toys & Games",
  "Pet Supplies",
  "Essentials"
]

export default function NewProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock_quantity: "",
    sku: "",
    weight: "",
    image_url: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      router.push("/")
      return
    }

    setIsAdmin(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      setImageFile(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        setError('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      // Check if either image file or URL is provided
      if (!imageFile && !formData.image_url) {
        setError('Please provide either an image file or URL')
        setIsLoading(false)
        return
      }

      // Create FormData
      const submitFormData = new FormData()
      submitFormData.append('name', formData.name)
      submitFormData.append('description', formData.description)
      submitFormData.append('price', formData.price)
      submitFormData.append('category', formData.category)
      submitFormData.append('stock_quantity', formData.stock_quantity)
      submitFormData.append('sku', formData.sku)
      submitFormData.append('weight', formData.weight)
      submitFormData.append('image_url', formData.image_url)
      
      if (imageFile) {
        submitFormData.append('image_file', imageFile)
      }

      // Call server action
      const result = await createProductWithImage(submitFormData)

      if (!result.success) {
        setError(result.error || 'Failed to create product')
        setIsLoading(false)
        return
      }

      // Success - redirect to products page
      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product")
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Market Mosaic Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm hover:text-muted-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm font-semibold">
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Back to Products
        </Link>

        <h1 className="text-4xl font-bold mb-8">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock and SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Product SKU"
              />
            </div>
          </div>

          {/* Weight */}
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (lbs) - Optional</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <Label>Product Image *</Label>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="grid gap-2">
                <Label htmlFor="image_file" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload className="h-4 w-4" />
                    Upload Image File
                  </div>
                </Label>
                <Input
                  id="image_file"
                  name="image_file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Accepts: JPG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <div className="border-2 border-border rounded-lg p-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* OR Divider */}
              <div className="relative flex items-center">
                <div className="border-t border-border flex-1"></div>
                <span className="px-4 text-sm text-muted-foreground">OR</span>
                <div className="border-t border-border flex-1"></div>
              </div>

              {/* Image URL */}
              <div className="grid gap-2">
                <Label htmlFor="image_url" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Enter Image URL
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!imageFile}
                />
                {imageFile && (
                  <p className="text-xs text-muted-foreground">
                    Image file is selected. Remove it to use URL instead.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating Product..." : "Create Product"}
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
