"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Chrome, Mail, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import ForgotPasswordModal from "@/components/ForgotPasswordModal"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotModal, setShowForgotModal] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("/api/auth/login", formData)
      if (response.data.success) {
        toast.success("Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = (provider) => {
    toast.error(`${provider} login is temporarily disabled`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/90 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent)] pointer-events-none"></div>
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("github")}
              className="bg-background/50 border-border/50 hover:bg-accent/50"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              className="bg-background/50 border-border/50 hover:bg-accent/50"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
      <Toaster position="top-right" />
    </div>
  )
}
