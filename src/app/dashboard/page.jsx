"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

import api from "@/helpers/api"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/verify-token")
        if (response.data.success) {
          setUser(response.data.user)
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout")
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Welcome back!
              </CardTitle>
              <CardDescription>
                You have successfully logged in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="space-y-2">
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
