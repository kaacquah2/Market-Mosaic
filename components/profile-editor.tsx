"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  avatar_url: string
}

export function ProfileEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    // First, try to get profile from user_profiles table
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      
      // If profile doesn't exist, try to sync from auth metadata
      if (error.code === 'PGRST116') {
        console.log("Profile doesn't exist, creating from auth metadata...")
        await createProfileFromAuth(user)
      }
    } else {
      setProfile(data)
      
      // Check if we need to sync auth metadata to profile
      const authMetadata = user.user_metadata || {}
      if (authMetadata.first_name || authMetadata.last_name) {
        if (!data.first_name && authMetadata.first_name) {
          // Sync first name if missing
          await supabase
            .from("user_profiles")
            .update({ first_name: authMetadata.first_name })
            .eq("user_id", user.id)
        }
        if (!data.last_name && authMetadata.last_name) {
          // Sync last name if missing
          await supabase
            .from("user_profiles")
            .update({ last_name: authMetadata.last_name })
            .eq("user_id", user.id)
        }
      }
      
      // Refetch to get updated data
      const { data: updatedData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
      
      if (updatedData) {
        setProfile(updatedData)
      }
    }

    setLoading(false)
  }

  const createProfileFromAuth = async (user: any) => {
    const supabase = createClient()
    const authMetadata = user.user_metadata || {}
    
    // Create profile with auth metadata
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: user.id,
        first_name: authMetadata.first_name || null,
        last_name: authMetadata.last_name || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating profile from auth:", error)
    } else if (data) {
      setProfile(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const formData = new FormData(e.currentTarget)
    const updates = {
      first_name: formData.get("first_name") || null,
      last_name: formData.get("last_name") || null,
      phone: formData.get("phone") || null,
      address_line1: formData.get("address_line1") || null,
      address_line2: formData.get("address_line2") || null,
      city: formData.get("city") || null,
      state: formData.get("state") || null,
      postal_code: formData.get("postal_code") || null,
      country: formData.get("country") || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", user.id)

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      fetchProfile()
    }

    setSaving(false)
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading profile...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                defaultValue={profile?.first_name || ""}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                defaultValue={profile?.last_name || ""}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone || ""}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input
              id="address_line1"
              name="address_line1"
              defaultValue={profile?.address_line1 || ""}
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
            <Input
              id="address_line2"
              name="address_line2"
              defaultValue={profile?.address_line2 || ""}
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                defaultValue={profile?.city || ""}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={profile?.state || ""}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">ZIP Code</Label>
              <Input
                id="postal_code"
                name="postal_code"
                defaultValue={profile?.postal_code || ""}
                placeholder="10001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              defaultValue={profile?.country || "US"}
              placeholder="United States"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

