import { createClient } from "@/lib/supabase/client"

export interface UserRole {
  id: string
  user_id: string
  role: string
  created_at: string
  updated_at: string
}

export class UserService {
  private supabase = createClient()

  async getUserRole(): Promise<string> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return 'customer'
    }

    const { data, error } = await this.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching user role:", error)
      return 'customer'
    }

    return data?.role || 'customer'
  }

  async isAdmin(): Promise<boolean> {
    const role = await this.getUserRole()
    return role === 'admin'
  }

  async setUserRole(userId: string, role: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("user_roles")
      .upsert({
        user_id: userId,
        role,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error("Error setting user role:", error)
      return false
    }

    return true
  }

  async getAllUsers(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from("user_roles")
      .select(`
        *,
        users:user_id (
          id,
          email,
          created_at
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return data || []
  }

  async getCurrentUser(): Promise<any> {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }
}

export const userService = new UserService()
