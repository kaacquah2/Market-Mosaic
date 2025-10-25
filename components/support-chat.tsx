"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { supportService, SupportTicket, SupportMessage } from "@/lib/support-service"
import { createClient } from "@/lib/supabase/client"

export function SupportChat() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchTickets()
    fetchUnreadCount()
  }, [])

  const fetchTickets = async () => {
    try {
      const data = await supportService.getUserTickets()
      setTickets(data)
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const count = await supportService.getUnreadMessageCount()
      setUnreadCount(count)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const handleTicketSelect = async (ticketId: string) => {
    try {
      const ticket = await supportService.getTicketById(ticketId)
      setSelectedTicket(ticket)
      
      // Mark messages as read
      if (ticket?.support_messages) {
        for (const message of ticket.support_messages) {
          if (message.is_admin && !message.read_at) {
            await supportService.markMessageAsRead(message.id)
          }
        }
      }
      
      fetchUnreadCount()
    } catch (error) {
      console.error("Error selecting ticket:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading support tickets...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex h-[600px] border rounded-lg">
      {/* Tickets List */}
      <div className="w-1/3 border-r p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Support Tickets</h3>
          <CreateTicketDialog onTicketCreated={fetchTickets} />
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {tickets.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No support tickets yet
              </p>
            ) : (
              tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => handleTicketSelect(ticket.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">{ticket.subject}</h4>
                      <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{ticket.category}</span>
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    {ticket.support_messages?.some(msg => msg.is_admin && !msg.read_at) && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">
                          New Message
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <ChatArea 
            ticket={selectedTicket} 
            onMessageSent={() => {
              fetchTickets()
              fetchUnreadCount()
            }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Ticket</h3>
              <p className="text-muted-foreground">
                Choose a support ticket to view the conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CreateTicketDialog({ onTicketCreated }: { onTicketCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState<string>("")
  const [priority, setPriority] = useState<string>("medium")
  const [message, setMessage] = useState("")
  const [creating, setCreating] = useState(false)

  const handleSubmit = async () => {
    if (!subject || !category || !message) {
      alert("Please fill in all required fields")
      return
    }

    setCreating(true)
    try {
      const ticketId = await supportService.createTicket(
        subject,
        category as any,
        priority as any,
        message
      )

      if (ticketId) {
        setOpen(false)
        setSubject("")
        setCategory("")
        setPriority("medium")
        setMessage("")
        onTicketCreated()
        alert("Support ticket created successfully!")
      } else {
        alert("Failed to create support ticket. Please try again.")
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create support ticket. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="order">Order Issue</SelectItem>
                <SelectItem value="product">Product Question</SelectItem>
                <SelectItem value="shipping">Shipping Issue</SelectItem>
                <SelectItem value="return">Return/Refund</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={creating || !subject || !category || !message}
            >
              {creating ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ChatArea({ ticket, onMessageSent }: { ticket: SupportTicket; onMessageSent: () => void }) {
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [ticket.support_messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const success = await supportService.addMessage(ticket.id, newMessage)
      if (success) {
        setNewMessage("")
        onMessageSent()
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      {/* Chat Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{ticket.subject}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </Badge>
              <span className="text-xs text-muted-foreground capitalize">
                {ticket.category} • {ticket.priority} priority
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(ticket.status)}
            <span className="text-sm text-muted-foreground">
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {ticket.support_messages?.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.is_admin
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.is_admin ? 'Support Team' : 'You'}
                </div>
                <div className="text-sm">{message.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      {ticket.status !== 'closed' && (
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !newMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
