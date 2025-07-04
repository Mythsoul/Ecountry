"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Chrome, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match"
      setError(errorMsg)
      toast.error(errorMsg)
      setLoading(false)
      return
    }

    try {
      // Create URL-encoded data as expected by your API
      const params = new URLSearchParams()
      params.append("username", formData.username)
      params.append("email", formData.email)
      params.append("password", formData.password)

      const response = await axios.post("/api/auth/signup", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      if (response.data.success) {
        const successMsg = "Account created successfully! Please check your email for verification."
        setSuccess(successMsg)
        toast.success(successMsg)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Signup failed"
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = (provider) => {
    console.log(`Signup with ${provider}`)
      toast.error(`${provider} signup is temporarily disabled`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/90 px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent)] pointer-events-none"></div>
      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-md">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
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
              onClick={() => handleOAuthSignup("github")}
              className="bg-background/50 border-border/50 hover:bg-accent/50"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignup("google")}
              className="bg-background/50 border-border/50 hover:bg-accent/50"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <Toaster position="top-right" />
    </div>
  )
}
