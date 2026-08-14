"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Building, UserCheck, AlertCircle, LogIn, Shield, Users, FileText, Zap, User } from "lucide-react"

interface LoginProps {
  onLogin: (user: any) => void
}

const demoUsers = [
  {
    id: "1",
    email: "sarah@company.com",
    name: "Sarah Johnson",
    role: "Lead Business Analyst",
    department: "IT",
    permissions: ["admin", "triage", "analysis", "documentation", "submit", "track"],
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    email: "emma@company.com",
    name: "Emma Wilson",
    role: "Senior Business Analyst",
    department: "IT",
    permissions: ["triage", "analysis", "documentation", "submit", "track"],
  },
  {
    id: "3",
    email: "jack@company.com",
    name: "Jack Davis",
    role: "Business Analyst",
    department: "IT",
    permissions: ["analysis", "documentation", "submit", "track"],
  },
  {
    id: "4",
    email: "mike@company.com",
    name: "Mike Chen",
    role: "Marketing Manager",
    department: "Marketing",
    permissions: ["submit", "track"],
  },
  {
    id: "5",
    email: "lisa@company.com",
    name: "Lisa Rodriguez",
    role: "Finance Director",
    department: "Finance",
    permissions: ["submit", "track"],
  },
]

export default function Login({ onLogin }: LoginProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = demoUsers.find((u) => u.email === email)

      if (user && password === "password123") {
        onLogin(user)
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        })
      } else {
        setError("Invalid email or password. Try password123 for demo accounts.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        role: "Business Analyst",
        department,
        permissions: ["analysis", "documentation", "submit", "track"],
      }

      onLogin(newUser)
      toast({
        title: "Account created successfully",
        description: `Welcome to the BA Toolkit, ${name}!`,
      })
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (user: any) => {
    onLogin(user)
    toast({
      title: "Demo login successful",
      description: `Logged in as ${user.name} (${user.role})`,
    })
  }

  const getRoleIcon = (role: string) => {
    if (role.includes("Lead")) return <Shield className="h-4 w-4" />
    if (role.includes("Senior")) return <UserCheck className="h-4 w-4" />
    if (role.includes("Analyst")) return <FileText className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  const getRoleColor = (role: string) => {
    if (role.includes("Lead")) return "destructive"
    if (role.includes("Senior")) return "default"
    if (role.includes("Analyst")) return "secondary"
    return "outline"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-lg p-3">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analyst Toolkit</h1>
          <p className="text-gray-600 mt-2">Streamline requirements, enhance collaboration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login/Signup Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LogIn className="h-5 w-5 mr-2" />
                Access Your Account
              </CardTitle>
              <CardDescription>Sign in to your account or create a new one to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-department">Department</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-department"
                          type="text"
                          placeholder="Enter your department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Demo Accounts
              </CardTitle>
              <CardDescription>Try the toolkit with different user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All demo accounts use password: <code className="bg-muted px-1 rounded">password123</code>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {demoUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getRoleColor(user.role)} className="text-xs">
                            {user.role}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {user.department}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDemoLogin(user)}>
                      Login
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Permission Levels:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-red-500" />
                    <span>Admin Access</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserCheck className="h-3 w-3 text-blue-500" />
                    <span>Triage Requests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3 text-green-500" />
                    <span>Analysis Tools</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-gray-500" />
                    <span>Submit & Track</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
