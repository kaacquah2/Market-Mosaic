import { createClient } from "@/lib/supabase/client"

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'general' | 'order' | 'product' | 'shipping' | 'return' | 'technical' | 'billing'
  created_at: string
  updated_at: string
  resolved_at?: string
  assigned_to?: string
  user_profiles?: {
    first_name?: string
    last_name?: string
  }
  support_messages?: SupportMessage[]
}

export interface SupportMessage {
  id: string
  ticket_id: string
  user_id?: string
  message: string
  is_admin: boolean
  created_at: string
  read_at?: string
  user_profiles?: {
    first_name?: string
    last_name?: string
  }
}

export class SupportService {
  private supabase = createClient()

  async createTicket(
    subject: string,
    category: SupportTicket['category'],
    priority: SupportTicket['priority'] = 'medium',
    initialMessage?: string
  ): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Create the ticket
    const { data: ticket, error: ticketError } = await this.supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject,
        category,
        priority
      })
      .select()
      .single()

    if (ticketError || !ticket) {
      console.error("Error creating ticket:", ticketError)
      return null
    }

    // Add initial message if provided
    if (initialMessage) {
      await this.addMessage(ticket.id, initialMessage)
    }

    return ticket.id
  }

  async addMessage(ticketId: string, message: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Verify the ticket belongs to the user
    const { data: ticket, error: ticketError } = await this.supabase
      .from("support_tickets")
      .select("id, user_id")
      .eq("id", ticketId)
      .eq("user_id", user.id)
      .single()

    if (ticketError || !ticket) {
      throw new Error("Ticket not found or doesn't belong to user")
    }

    const { error } = await this.supabase
      .from("support_messages")
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_admin: false
      })

    if (error) {
      console.error("Error adding message:", error)
      return false
    }

    // Update ticket timestamp
    await this.supabase
      .from("support_tickets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", ticketId)

    return true
  }

  async getUserTickets(): Promise<SupportTicket[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await this.supabase
      .from("support_tickets")
      .select(`
        *,
        support_messages (
          *,
          user_profiles (
            first_name,
            last_name
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tickets:", error)
      return []
    }

    return data || []
  }

  async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await this.supabase
      .from("support_tickets")
      .select(`
        *,
        support_messages (
          *,
          user_profiles (
            first_name,
            last_name
          )
        )
      `)
      .eq("id", ticketId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching ticket:", error)
      return null
    }

    return data
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    const updateData: any = { status }
    
    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString()
    }

    const { error } = await this.supabase
      .from("support_tickets")
      .update(updateData)
      .eq("id", ticketId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating ticket:", error)
      return false
    }

    return true
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("support_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId)

    if (error) {
      console.error("Error marking message as read:", error)
      return false
    }

    return true
  }

  async getUnreadMessageCount(): Promise<number> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return 0
    }

    // Get user's ticket IDs first
    const { data: tickets } = await this.supabase
      .from("support_tickets")
      .select("id")
      .eq("user_id", user.id)

    if (!tickets || tickets.length === 0) {
      return 0
    }

    const ticketIds = tickets.map(ticket => ticket.id)

    const { count, error } = await this.supabase
      .from("support_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_admin", true)
      .is("read_at", null)
      .in("ticket_id", ticketIds)

    if (error) {
      console.error("Error getting unread count:", error)
      return 0
    }

    return count || 0
  }

  // Admin methods
  async getAllTickets(): Promise<SupportTicket[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    // Check if user is admin
    const { data: profile } = await this.supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    const { data, error } = await this.supabase
      .from("support_tickets")
      .select(`
        *,
        user_profiles (
          first_name,
          last_name
        ),
        support_messages (
          *,
          user_profiles (
            first_name,
            last_name
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all tickets:", error)
      return []
    }

    return data || []
  }

  async addAdminMessage(ticketId: string, message: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if user is admin
    const { data: profile } = await this.supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    const { error } = await this.supabase
      .from("support_messages")
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_admin: true
      })

    if (error) {
      console.error("Error adding admin message:", error)
      return false
    }

    // Update ticket timestamp
    await this.supabase
      .from("support_tickets")
      .update({ 
        updated_at: new Date().toISOString(),
        status: 'in_progress'
      })
      .eq("id", ticketId)

    return true
  }

  async assignTicket(ticketId: string, adminUserId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Check if user is admin
    const { data: profile } = await this.supabase
      .from("user_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    const { error } = await this.supabase
      .from("support_tickets")
      .update({ 
        assigned_to: adminUserId,
        status: 'in_progress'
      })
      .eq("id", ticketId)

    if (error) {
      console.error("Error assigning ticket:", error)
      return false
    }

    return true
  }
}

export const supportService = new SupportService()
