import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { logoutAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Package, Settings, LogOut, RotateCcw, Bell } from "lucide-react"
import { TwoFactorSettings } from "@/components/two-factor-auth"
import { PushNotificationSetup } from "@/components/push-notification-setup"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Fetch user's orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {profile?.first_name && profile?.last_name 
                ? `${profile.first_name} ${profile.last_name}` 
                : user.email}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-primary">{orders?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg p-6 border border-secondary/20">
            <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-secondary">
              $
              {(orders?.reduce((sum: number, order: any) => sum + Number.parseFloat(order.total || 0), 0) || 0).toFixed(
                2,
              )}
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-6 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">Member Since</p>
            <p className="text-3xl font-bold text-accent">{new Date(user.created_at || "").getFullYear()}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">
                <Package className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/account/returns">
              <Button variant="outline" className="bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                My Returns
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="bg-transparent">
                <Settings className="mr-2 h-4 w-4" />
                Get Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Order History</h2>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}>
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border border-primary/20 group">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                        <p className="font-mono text-sm font-semibold group-hover:text-primary transition-colors">
                          {order.id.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                        <p className="text-2xl font-bold text-primary">
                          ${Number.parseFloat(order.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      <span className="bg-accent/20 text-accent px-3 py-1 rounded text-xs font-semibold">
                        {order.status || "pending"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Security Settings</h2>
          <TwoFactorSettings />
        </div>

        {/* Notification Settings */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notification Settings
          </h2>
          <PushNotificationSetup />
        </div>
      </div>
    </div>
  )
}
