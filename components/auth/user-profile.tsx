"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  UserIcon,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Settings,
  Activity,
  Save,
  Edit,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  Key,
  LogOut,
  Eye,
} from "lucide-react"

interface UserProfileProps {
  user: {
    id: string
    email: string
    name: string
    role: string
    department: string
    permissions: string[]
    avatar?: string
    phone?: string
    location?: string
    bio?: string
    joinDate?: string
    lastLogin?: string
  }
  onUserUpdate: (user: any) => void
  onLogout: () => void
}

export default function UserProfile({ user, onUserUpdate, onLogout }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    requestUpdates: true,
    weeklyDigest: true,
    systemAlerts: true,
    marketingEmails: false,
  })
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    defaultDashboard: "overview",
    autoSave: true,
    compactView: false,
    showTutorials: true,
  })
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceTracking: true,
  })

  const { toast } = useToast()

  const handleSaveProfile = () => {
    onUserUpdate(editedUser)
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleCancelEdit = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getPermissionBadgeColor = (permission: string) => {
    switch (permission) {
      case "admin":
        return "destructive"
      case "triage":
        return "default"
      case "analysis":
        return "secondary"
      case "documentation":
        return "outline"
      default:
        return "outline"
    }
  }

  const recentActivity = [
    { action: "Updated backlog item STORY-123", time: "2 hours ago", type: "edit" },
    { action: "Completed triage for 3 requests", time: "1 day ago", type: "complete" },
    { action: "Created new requirement template", time: "2 days ago", type: "create" },
    { action: "Reviewed gap analysis report", time: "3 days ago", type: "review" },
    { action: "Participated in stakeholder meeting", time: "1 week ago", type: "meeting" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "create":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "review":
        return <Eye className="h-4 w-4 text-orange-500" />
      case "meeting":
        return <Users className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and account settings</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information and contact details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={editedUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">{getInitials(editedUser.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{editedUser.name}</h3>
                  <p className="text-muted-foreground">{editedUser.role}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{editedUser.department}</Badge>
                    <Badge variant="secondary">ID: {editedUser.id}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={editedUser.phone || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="pl-10"
                      placeholder="Enter phone number"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={editedUser.location || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                      className="pl-10"
                      placeholder="City, Country"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      value={editedUser.department}
                      onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={editedUser.role} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Role changes require admin approval</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editedUser.bio || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  disabled={!isEditing}
                />
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {editedUser.permissions.map((permission) => (
                    <Badge key={permission} variant={getPermissionBadgeColor(permission)}>
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Permission changes require admin approval. Contact your system administrator.
                </p>
              </div>

              {/* Account Info */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {user.joinDate || "January 2024"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Last login: {user.lastLogin || "2 hours ago"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Activity Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Requirements</span>
                  </div>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Meetings</span>
                  </div>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Reports</span>
                  </div>
                  <span className="font-semibold">6</span>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Score */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Productivity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">87</div>
                  <Progress value={87} className="h-2" />
                  <p className="text-xs text-muted-foreground">Above average performance</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  New Requirement
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Notifications
                </h4>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Request Updates</p>
                      <p className="text-xs text-muted-foreground">Get notified when requests are updated</p>
                    </div>
                    <Switch
                      checked={notifications.requestUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, requestUpdates: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly Digest</p>
                      <p className="text-xs text-muted-foreground">Weekly summary of your activities</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">System Alerts</p>
                      <p className="text-xs text-muted-foreground">Important system notifications</p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Marketing Emails</p>
                      <p className="text-xs text-muted-foreground">Product updates and newsletters</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Push Notifications
                </h4>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Browser Notifications</p>
                      <p className="text-xs text-muted-foreground">Show notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">Urgent notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>Changes to notification preferences are saved automatically.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Two-Factor Authentication
                </h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Enable 2FA</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                    />
                    {security.twoFactorEnabled && <Badge variant="secondary">Enabled</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Management */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Session Management
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <Select
                      value={security.sessionTimeout.toString()}
                      onValueChange={(value) => setSecurity({ ...security, sessionTimeout: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Login Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Device Tracking</p>
                      <p className="text-xs text-muted-foreground">Track devices used to access your account</p>
                    </div>
                    <Switch
                      checked={security.deviceTracking}
                      onCheckedChange={(checked) => setSecurity({ ...security, deviceTracking: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Password */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Password
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Change Password</p>
                      <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  For your security, we recommend enabling two-factor authentication and using a strong, unique
                  password.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your experience with the BA Toolkit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appearance */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Monitor className="h-4 w-4 mr-2" />
                  Appearance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Regional Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Regional Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dashboard Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard Settings
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Default Dashboard</Label>
                    <Select
                      value={preferences.defaultDashboard}
                      onValueChange={(value) => setPreferences({ ...preferences, defaultDashboard: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="requirements">Requirements Intake</SelectItem>
                        <SelectItem value="backlog">Backlog Refinement</SelectItem>
                        <SelectItem value="analysis">Agile Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Compact View</p>
                      <p className="text-xs text-muted-foreground">Show more information in less space</p>
                    </div>
                    <Switch
                      checked={preferences.compactView}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-save</p>
                      <p className="text-xs text-muted-foreground">Automatically save changes as you work</p>
                    </div>
                    <Switch
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Show Tutorials</p>
                      <p className="text-xs text-muted-foreground">Display helpful tips and tutorials</p>
                    </div>
                    <Switch
                      checked={preferences.showTutorials}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, showTutorials: checked })}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Preference changes are saved automatically and will take effect immediately.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
