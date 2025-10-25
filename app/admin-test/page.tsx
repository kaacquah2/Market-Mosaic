"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminTestPage() {
  const router = useRouter()
  const [status, setStatus] = useState("Checking...")
  const [userInfo, setUserInfo] = useState<any>(null)
  const [roleInfo, setRoleInfo] = useState<any>(null)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setStatus(`Not logged in: ${userError?.message}`)
        return
      }

      setUserInfo({
        id: user.id,
        email: user.email,
      })

      // Check role
      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (roleError) {
        setStatus(`Role check error: ${roleError.message}`)
        setRoleInfo({ error: roleError.message })
        return
      }

      setRoleInfo(role)
      
      if (role && role.role === 'admin') {
        setStatus("✅ Admin access granted!")
        setTimeout(() => {
          router.push("/admin")
        }, 2000)
      } else {
        setStatus(`❌ Not admin. Current role: ${role?.role || 'null'}`)
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold">Admin Status Check</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Status:</h2>
            <p className="text-xl">{status}</p>
          </div>

          {userInfo && (
            <div>
              <h2 className="text-lg font-semibold mb-2">User Info:</h2>
              <pre className="bg-muted p-4 rounded overflow-auto text-sm">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </div>
          )}

          {roleInfo && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Role Info:</h2>
              <pre className="bg-muted p-4 rounded overflow-auto text-sm">
                {JSON.stringify(roleInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-4 border-t">
            <button
              onClick={checkAdminStatus}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Re-check Status
            </button>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-semibold mb-2">What to do:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>If you see "Not admin", run the SQL script in Supabase</li>
            <li>If you see "Role check error", the table might not exist</li>
            <li>If you see "Admin access granted", you'll be redirected to /admin</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

