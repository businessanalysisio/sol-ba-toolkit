"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { fetchBacklogData } from "@/app/actions"
import { Filter, Search, Plus, Edit, Trash2, ArrowUp, ArrowDown, BarChart3, Target, Users, Clock, TrendingUp, AlertTriangle, CheckCircle, Star, Layers, GitBranch, Calendar, FileText, Download, Upload, RefreshCw } from 'lucide-react'

interface BacklogItem {
  id: string
  title: string
  description: string
  priority: string
  effort: number
  businessValue: number
  cluster: string
  status: string
  stakeholder: string
  lastUpdated: string
  dependencies: string[]
  type: string
  assigned_to_name?: string
  project_name?: string
}

interface Cluster {
  name: string
  items: number
  totalEffort: number
  avgBusinessValue: number
  priority: string
  completion: number
}

interface GapAnalysis {
  area: string
  coverage: number
  recommendation: string
  priority: string
}

export default function BacklogRefinement() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null)

  // Form state for creating/editing items
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    effort: 5,
    businessValue: 5,
    cluster: "",
    type: "Feature",
    stakeholder: "",
  })

  useEffect(() => {
    loadBacklogData()
  }, [])

  const loadBacklogData = async () => {
    try {
      setLoading(true)
      const data = await fetchBacklogData()
      if (data) {
        setBacklogItems(data.backlogItems || [])
        setClusters(data.clusters || [])
        setGapAnalysis(data.gapAnalysis || [])
      }
    } catch (error) {
      console.error("Error loading backlog data:", error)
      toast({
        title: "Error",
        description: "Failed to load backlog data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = backlogItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "backlog":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCreateItem = () => {
    // In a real app, this would call an API
    const newItem: BacklogItem = {
      id: `STORY-${Date.now()}`,
      ...formData,
      lastUpdated: new Date().toLocaleDateString(),
      dependencies: [],
      status: "Backlog",
      assigned_to_name: "Unassigned",
      project_name: "Current Project",
    }

    setBacklogItems([...backlogItems, newItem])
    setShowCreateDialog(false)
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      effort: 5,
      businessValue: 5,
      cluster: "",
      type: "Feature",
      stakeholder: "",
    })

    toast({
      title: "Success",
      description: "Backlog item created successfully",
    })
  }

  const handleEditItem = (item: BacklogItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      priority: item.priority,
      effort: item.effort,
      businessValue: item.businessValue,
      cluster: item.cluster,
      type: item.type,
      stakeholder: item.stakeholder,
    })
    setShowCreateDialog(true)
  }

  const handleUpdateItem = () => {
    if (!editingItem) return

    const updatedItems = backlogItems.map((item) =>
      item.id === editingItem.id
        ? {
            ...item,
            ...formData,
            lastUpdated: new Date().toLocaleDateString(),
          }
        : item
    )

    setBacklogItems(updatedItems)
    setShowCreateDialog(false)
    setEditingItem(null)
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      effort: 5,
      businessValue: 5,
      cluster: "",
      type: "Feature",
      stakeholder: "",
    })

    toast({
      title: "Success",
      description: "Backlog item updated successfully",
    })
  }

  const handleDeleteItem = (itemId: string) => {
    setBacklogItems(backlogItems.filter((item) => item.id !== itemId))
    toast({
      title: "Success",
      description: "Backlog item deleted successfully",
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to perform bulk actions",
        variant: "destructive",
      })
      return
    }

    switch (action) {
      case "delete":
        setBacklogItems(backlogItems.filter((item) => !selectedItems.includes(item.id)))
        setSelectedItems([])
        toast({
          title: "Success",
          description: `Deleted ${selectedItems.length} items`,
        })
        break
      case "high-priority":
        const updatedItems = backlogItems.map((item) =>
          selectedItems.includes(item.id) ? { ...item, priority: "High" } : item
        )
        setBacklogItems(updatedItems)
        setSelectedItems([])
        toast({
          title: "Success",
          description: `Updated ${selectedItems.length} items to high priority`,
        })
        break
      default:
        break
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading backlog data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Backlog Refinement</h2>
          <p className="text-gray-600">Manage and prioritize your product backlog</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadBacklogData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="backlog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backlog">Backlog Items</TabsTrigger>
          <TabsTrigger value="clusters">Cluster Analysis</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="backlog" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search backlog items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Backlog">Backlog</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                {selectedItems.length > 0 && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("high-priority")}
                    >
                      Set High Priority
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction("delete")}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete ({selectedItems.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Backlog Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Backlog Items ({filteredItems.length})</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                          onCheckedChange={selectAllItems}
                        />
                      </TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Effort</TableHead>
                      <TableHead>Business Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Stakeholder</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleItemSelection(item.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-600 truncate max-w-xs">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span>{item.effort}</span>
                            <span className="text-xs text-gray-500">pts</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{item.businessValue}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.cluster}</Badge>
                        </TableCell>
                        <TableCell>{item.stakeholder}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <Card key={cluster.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{cluster.name}</span>
                    <Badge className={getPriorityColor(cluster.priority)}>{cluster.priority}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Items</span>
                      <span className="font-medium">{cluster.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Effort</span>
                      <span className="font-medium">{cluster.totalEffort} pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Business Value</span>
                      <span className="font-medium">{cluster.avgBusinessValue.toFixed(1)}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span>{cluster.completion}%</span>
                      </div>
                      <Progress value={cluster.completion} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapAnalysis.map((gap) => (
              <Card key={gap.area}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{gap.area}</span>
                    <Badge className={getPriorityColor(gap.priority)}>{gap.priority}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Coverage</span>
                        <span>{gap.coverage}%</span>
                      </div>
                      <Progress value={gap.coverage} className="h-2" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Recommendation</p>
                      <p className="text-sm text-gray-600">{gap.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{backlogItems.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ready Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {backlogItems.filter((item) => item.status === "Ready").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Effort</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {backlogItems.reduce((sum, item) => sum + item.effort, 0)} pts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Business Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(backlogItems.reduce((sum, item) => sum + item.businessValue, 0) / backlogItems.length || 0).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["High", "Medium", "Low"].map((priority) => {
                  const count = backlogItems.filter((item) => item.priority === priority).length
                  const percentage = backlogItems.length > 0 ? (count / backlogItems.length) * 100 : 0
                  return (
                    <div key={priority} className="flex items-center space-x-3">
                      <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12">{count}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Backlog Item" : "Create New Backlog Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the backlog item details" : "Add a new item to the product backlog"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter item title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="stakeholder">Stakeholder</Label>
                <Input
                  id="stakeholder"
                  value={formData.stakeholder}
                  onChange={(e) => setFormData({ ...formData, stakeholder: e.target.value })}
                  placeholder="Enter stakeholder name"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feature">Feature</SelectItem>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Improvement">Improvement</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cluster">Cluster</Label>
                <Input
                  id="cluster"
                  value={formData.cluster}
                  onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                  placeholder="Enter cluster name"
                />
              </div>
              <div>
                <Label htmlFor="effort">Effort (Story Points)</Label>
                <Select value={formData.effort.toString()} onValueChange={(value) => setFormData({ ...formData, effort: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="13">13</SelectItem>
                    <SelectItem value="21">21</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="businessValue">Business Value (1-10)</Label>
                <Select value={formData.businessValue.toString()} onValueChange={(value) => setFormData({ ...formData, businessValue: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={editingItem ? handleUpdateItem : handleCreateItem}>
              {editingItem ? "Update Item" : "Create Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
