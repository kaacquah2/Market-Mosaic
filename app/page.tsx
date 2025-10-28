"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { AppConfig } from "@/lib/config"
import { PersonalizedHomepage } from "@/components/ai-recommendations"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  created_at?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8)

      if (error) {
        console.error("Error fetching products:", error)
        return
      }

      setProducts(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("is_active", true)

      if (error) {
        console.error("Error fetching categories:", error)
        return
      }

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(p => p.category).filter(Boolean) || []))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error:", error)
    }
  }


  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder.svg") {
      target.src = "/placeholder.svg";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32 relative z-10">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest">Welcome to Market Mosaic</p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                Discover Your{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Perfect Match
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Explore curated products, tech innovations, and lifestyle essentials from trusted sellers.
                Quality meets convenience.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="font-semibold bg-transparent">
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Shop by Vibe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.slice(0, 3).map((category, index) => {
            const colors = ["from-primary", "from-accent", "from-secondary"]
            const icons = ["👕", "🎮", "✨"]
            return (
              <Link key={category} href={`/products?category=${category}`}>
                <div
                  className={`bg-gradient-to-br ${colors[index % colors.length]} to-transparent rounded-2xl p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                >
                  <div className="text-5xl mb-4">{icons[index % icons.length]}</div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:translate-x-2 transition-transform">
                    {category}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">Explore now →</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">Trending Now</h2>
          <Link href="/products">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All →
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="bg-muted rounded-xl overflow-hidden mb-4 aspect-square relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={handleImageError}
                    />
                    {/* Show "New" badge for products created within last 30 days */}
                    {product.created_at && new Date(product.created_at) > new Date(Date.now() - AppConfig.getNewProductThresholdDays() * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                        New
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3 uppercase tracking-wide">{product.category}</p>
                  <p className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No products available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PersonalizedHomepage />
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-primary">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-foreground transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/account" className="hover:text-foreground transition-colors">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-primary">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Market Mosaic. All rights reserved. Quality marketplace.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
