'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Plus, Send, Calendar, Users, Target, Bell, Edit, Trash2 } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  type: string
  template_id: string
  target_audience: any
  scheduled_at?: string
  sent_at?: string
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  created_at: string
  notification_templates?: {
    name: string
    title: string
  }
}

interface Template {
  id: string
  name: string
  type: string
  title: string
  message: string
  icon?: string
  action_url?: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'promotion',
    templateId: '',
    targetAudience: {
      allUsers: true,
      minOrders: 0,
      country: ''
    },
    scheduledAt: ''
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      window.location.href = '/'
      return
    }

    setUser(user)
    await Promise.all([
      fetchCampaigns(),
      fetchTemplates()
    ])
  }

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/campaigns')
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/notification-templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const createCampaign = async () => {
    if (!formData.name || !formData.templateId) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          templateId: formData.templateId,
          targetAudience: formData.targetAudience,
          scheduledAt: formData.scheduledAt || null
        })
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setFormData({
          name: '',
          type: 'promotion',
          templateId: '',
          targetAudience: {
            allUsers: true,
            minOrders: 0,
            country: ''
          },
          scheduledAt: ''
        })
        fetchCampaigns()
        alert('Campaign created successfully!')
      } else {
        alert('Failed to create campaign')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Failed to create campaign')
    } finally {
      setCreating(false)
    }
  }

  const sendCampaign = async (campaignId: string) => {
    setSending(campaignId)
    try {
      const response = await fetch('/api/admin/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })

      if (response.ok) {
        fetchCampaigns()
        alert('Campaign sent successfully!')
      } else {
        alert('Failed to send campaign')
      }
    } catch (error) {
      console.error('Error sending campaign:', error)
      alert('Failed to send campaign')
    } finally {
      setSending(null)
    }
  }

  const createBlackFridayCampaign = async () => {
    // Find Black Friday template
    const blackFridayTemplate = templates.find(t => t.name === 'Black Friday Sale')
    
    if (!blackFridayTemplate) {
      alert('Black Friday template not found. Please create it first.')
      return
    }

    setFormData({
      name: 'Black Friday 2024',
      type: 'promotion',
      templateId: blackFridayTemplate.id,
      targetAudience: {
        allUsers: true,
        minOrders: 0,
        country: ''
      },
      scheduledAt: new Date('2024-11-29T00:00:00Z').toISOString()
    })

    await createCampaign()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'default'
      case 'scheduled': return 'secondary'
      case 'draft': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'draft': return <Edit className="h-4 w-4" />
      case 'cancelled': return <Trash2 className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading campaigns...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <AdminHeader userEmail={user?.email} />
        
        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notification Campaigns</h1>
              <p className="text-muted-foreground">
                Create and manage promotional campaigns and notifications
              </p>
            </div>
          <div className="flex gap-3">
            <Button onClick={createBlackFridayCampaign} variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Black Friday Campaign
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Create a new notification campaign to reach your customers
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Black Friday Sale 2024"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Campaign Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="template">Template</Label>
                    <Select value={formData.templateId} onValueChange={(value) => setFormData(prev => ({ ...prev, templateId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} - {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target">Target Audience</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allUsers"
                          checked={formData.targetAudience.allUsers}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            targetAudience: { ...prev.targetAudience, allUsers: e.target.checked }
                          }))}
                        />
                        <Label htmlFor="allUsers">All Users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="minOrders">Minimum Orders:</Label>
                        <Input
                          id="minOrders"
                          type="number"
                          value={formData.targetAudience.minOrders}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            targetAudience: { ...prev.targetAudience, minOrders: parseInt(e.target.value) || 0 }
                          }))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createCampaign} disabled={creating}>
                      {creating ? 'Creating...' : 'Create Campaign'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid gap-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first notification campaign to reach your customers
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(campaign.status)}
                        {campaign.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campaign.notification_templates?.title}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {campaign.target_audience?.allUsers ? 'All Users' : 'Targeted'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {campaign.scheduled_at 
                          ? new Date(campaign.scheduled_at).toLocaleDateString()
                          : 'Immediate'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bell className="h-4 w-4" />
                      <span>
                        {campaign.sent_at 
                          ? new Date(campaign.sent_at).toLocaleDateString()
                          : 'Not sent'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => sendCampaign(campaign.id)}
                        disabled={sending === campaign.id}
                      >
                        {sending === campaign.id ? 'Sending...' : 'Send Now'}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          </div>
        </main>
      </div>
    </div>
  )
}

