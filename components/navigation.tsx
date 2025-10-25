"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { User, Search } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        >
          Market Mosaic
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/products" className="text-sm font-semibold hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/search" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
            <Search className="h-4 w-4" />
            Search
          </Link>
          {user && (
            <Link href="/wishlist" className="text-sm font-semibold hover:text-primary transition-colors">
              Wishlist
            </Link>
          )}
          <Link href="/cart" className="text-sm font-semibold hover:text-primary transition-colors">
            Cart
          </Link>
          <Link href="/support" className="text-sm font-semibold hover:text-primary transition-colors">
            Support
          </Link>
          <LanguageSwitcher />
          {loading ? (
            <div className="w-20 h-8" />
          ) : user ? (
            <Link href="/account">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
