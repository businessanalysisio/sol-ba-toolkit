"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterTier, setFilterTier] = useState("all")

  // Mock data for users and partners
  const mockUsers = [
    {
      id: "USR-001",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "B2C Customer",
      status: "Active",
      tier: "N/A",
      lastLogin: "2 hours ago",
      orders: 15,
    },
    {
      id: "PTR-001",
      name: "ABC Corp",
      email: "contact@abccorp.com",
      role: "B2B Partner",
      status: "Active",
      tier: "Gold",
      lastLogin: "1 day ago",
      orders: 45,
    },
    {
      id: "PTR-002",
      name: "XYZ Industries",
      email: "orders@xyzind.com",
      role: "B2B Partner",
      status: "Suspended",
      tier: "Silver",
      lastLogin: "1 week ago",
      orders: 23,
    },
    {
      id: "USR-002",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "B2C Customer",
      status: "Active",
      tier: "N/A",
      lastLogin: "5 minutes ago",
      orders: 8,
    },
    {
      id: "PTR-003",
      name: "Global Solutions Ltd",
      email: "procurement@globalsol.com",
      role: "B2B Partner",
      status: "Active",
      tier: "Platinum",
      lastLogin: "3 hours ago",
      orders: 127,
    },
  ]

  // Mock data for products
  const mockProducts = [
    {
      id: "PROD-001",
      name: "Wireless Headphones",
      category: "Electronics",
      retailPrice: 199.99,
      silverPrice: 179.99,
      goldPrice: 169.99,
      platinumPrice: 159.99,
      stock: 150,
      warehouse: "WH-A",
      status: "In Stock",
    },
    {
      id: "PROD-002",
      name: "Bluetooth Speaker",
      category: "Electronics",
      retailPrice: 89.99,
      silverPrice: 80.99,
      goldPrice: 76.49,
      platinumPrice: 71.99,
      stock: 5,
      warehouse: "WH-B",
      status: "Low Stock",
    },
    {
      id: "PROD-003",
      name: "Smart Watch",
      category: "Wearables",
      retailPrice: 299.99,
      silverPrice: 269.99,
      goldPrice: 254.99,
      platinumPrice: 239.99,
      stock: 0,
      warehouse: "WH-A",
      status: "Out of Stock",
    },
    {
      id: "PROD-004",
      name: "Laptop Stand",
      category: "Accessories",
      retailPrice: 49.99,
      silverPrice: 44.99,
      goldPrice: 42.49,
      platinumPrice: 39.99,
      stock: 75,
      warehouse: "WH-C",
      status: "In Stock",
    },
  ]

  // Mock data for orders
  const mockOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      channel: "B2C",
      date: "2025-06-29",
      total: 199.99,
      status: "Fulfilled",
      items: 1,
      tracking: "TRK123456",
    },
    {
      id: "ORD-002",
      customer: "ABC Corp",
      channel: "B2B",
      date: "2025-06-28",
      total: 8099.55,
      status: "Processing",
      items: 45,
      tracking: null,
    },
    {
      id: "ORD-003",
      customer: "Jane Doe",
      channel: "B2C",
      date: "2025-06-30",
      total: 89.99,
      status: "Pending",
      items: 1,
      tracking: null,
    },
    {
      id: "ORD-004",
      customer: "Global Solutions Ltd",
      channel: "B2B",
      date: "2025-06-27",
      total: 15999.73,
      status: "Fulfilled",
      items: 127,
      tracking: "TRK789012",
    },
  ]

  // Mock data for back-orders
  const mockBackOrders = [
    {
      id: "BO-001",
      partner: "ABC Corp",
      tier: "Gold",
      product: "Smart Watch",
      sku: "PROD-003",
      quantity: 10,
      status: "Pending",
      requestDate: "2025-06-25",
      eta: "2025-07-15",
    },
    {
      id: "BO-002",
      partner: "XYZ Industries",
      tier: "Silver",
      product: "Wireless Headphones",
      sku: "PROD-001",
      quantity: 25,
      status: "Approved",
      requestDate: "2025-06-20",
      eta: "2025-07-05",
    },
    {
      id: "BO-003",
      partner: "Global Solutions Ltd",
      tier: "Platinum",
      product: "Bluetooth Speaker",
      sku: "PROD-002",
      quantity: 50,
      status: "Waitlisted",
      requestDate: "2025-06-30",
      eta: "2025-07-20",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "Suspended":
        return <Badge className="bg-red-500 hover:bg-red-600">Suspended</Badge>
      case "Pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case "Fulfilled":
        return <Badge className="bg-green-500 hover:bg-green-600">Fulfilled</Badge>
      case "Processing":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>
      case "In Stock":
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>
      case "Low Stock":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Low Stock</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-500 hover:bg-red-600">Out of Stock</Badge>
      case "Approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "Waitlisted":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Waitlisted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Platinum</Badge>
      case "Gold":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Gold</Badge>
      case "Silver":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Silver</Badge>
      default:
        return <Badge variant="outline">{tier}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users, products, orders, and analytics</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users & Partners
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products & Inventory
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Order Oversight
          </TabsTrigger>
          <TabsTrigger value="backorders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Back-Orders
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics & Reporting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User & Partner Management</CardTitle>
              <CardDescription>Manage B2C customers and B2B partners with tier assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users and partners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="B2C Customer">B2C Customer</SelectItem>
                    <SelectItem value="B2B Partner">B2B Partner</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterTier} onValueChange={setFilterTier}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name/Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.tier !== "N/A" ? getTierBadge(user.tier) : "N/A"}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>{user.orders}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product & Inventory Management</CardTitle>
              <CardDescription>Manage product catalog and stock levels for B2C and B2B channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-8" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Wearables">Wearables</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Products
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Retail Price</TableHead>
                    <TableHead>B2B Pricing</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.retailPrice}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>Silver: ${product.silverPrice}</div>
                          <div>Gold: ${product.goldPrice}</div>
                          <div>Platinum: ${product.platinumPrice}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.stock}
                          {product.stock <= 5 && product.stock > 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          {product.stock === 0 && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>{product.warehouse}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Oversight and Fulfillment Control</CardTitle>
              <CardDescription>Monitor and manage order lifecycle across B2C and B2B channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-8" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="B2B">B2B</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button variant="outline">Batch Update Status</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant={order.channel === "B2C" ? "default" : "secondary"}>{order.channel}</Badge>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>${order.total}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.tracking || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Trigger Shipment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backorders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Back-Order Approval Flow</CardTitle>
              <CardDescription>Handle partner-submitted requests for out-of-stock items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search back-orders..." className="pl-8" />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBackOrders.map((backOrder) => (
                    <TableRow key={backOrder.id}>
                      <TableCell className="font-medium">{backOrder.id}</TableCell>
                      <TableCell>{backOrder.partner}</TableCell>
                      <TableCell>{getTierBadge(backOrder.tier)}</TableCell>
                      <TableCell>{backOrder.product}</TableCell>
                      <TableCell>{backOrder.sku}</TableCell>
                      <TableCell>{backOrder.quantity}</TableCell>
                      <TableCell>{getStatusBadge(backOrder.status)}</TableCell>
                      <TableCell>{backOrder.requestDate}</TableCell>
                      <TableCell>{backOrder.eta}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-orange-600">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <Label htmlFor="admin-comment">Admin Comment</Label>
                <Textarea
                  id="admin-comment"
                  placeholder="Add internal notes or comments for back-order processing..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 out of stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fulfillment SLA</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Breakdown</CardTitle>
                <CardDescription>B2C vs B2B revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Chart: B2C vs B2B Sales]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top-Selling Products</CardTitle>
                <CardDescription>Most popular items this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Chart: Product Performance]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partner Performance by Tier</CardTitle>
                <CardDescription>Order volume and frequency by partner tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Chart: Partner Tier Analysis]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>Stock movement and warehouse efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  [Chart: Inventory Analytics]
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report Generation</CardTitle>
              <CardDescription>Generate and schedule automated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
