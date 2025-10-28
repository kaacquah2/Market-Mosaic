"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { User, Search, Menu } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function Navigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const navLinks = (
    <>
      <Link href="/products" className="text-sm font-semibold hover:text-primary transition-colors">
        Shop
      </Link>
      <Link href="/search" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
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
    </>
  )

  const mobileNavLinks = (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/products" className="text-base font-semibold hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
        Shop
      </Link>
      <Link href="/search" className="text-base font-semibold hover:text-primary transition-colors flex items-center gap-2 py-2" onClick={() => setMenuOpen(false)}>
        <Search className="h-5 w-5" />
        Search
      </Link>
      {user && (
        <Link href="/wishlist" className="text-base font-semibold hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
          Wishlist
        </Link>
      )}
      <Link href="/cart" className="text-base font-semibold hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
        Cart
      </Link>
      <Link href="/support" className="text-base font-semibold hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
        Support
      </Link>
    </div>
  )

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        >
          Market Mosaic
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks}
          <LanguageSwitcher />
          {loading ? (
            <div className="w-20 h-8" />
          ) : user ? (
            <Link href="/account">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">Profile</span>
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              {mobileNavLinks}
              <div className="mt-4 px-4 space-y-3">
                <LanguageSwitcher />
                {loading ? (
                  <div className="w-full h-10" />
                ) : user ? (
                  <Link href="/account">
                    <Button variant="outline" className="w-full gap-2" onClick={() => setMenuOpen(false)}>
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" className="w-full" onClick={() => setMenuOpen(false)}>
                        Log In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button className="w-full" onClick={() => setMenuOpen(false)}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
