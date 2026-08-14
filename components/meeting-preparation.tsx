"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users, AlertCircle, ClipboardList, Lightbulb, FileText, Plus, Loader2 } from "lucide-react"
import { fetchMeetingData, addMeetingDecision, addMeetingActionItem, generateMeetingNotes } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function MeetingPreparation() {
  const { toast } = useToast()
  const [meetingData, setMeetingData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [newDecisionText, setNewDecisionText] = useState("")
  const [newActionItemText, setNewActionItemText] = useState("")
  const [newActionItemAssignee, setNewActionItemAssignee] = useState("")
  const [isAddingDecision, setIsAddingDecision] = useState(false)
  const [isAddingActionItem, setIsAddingActionItem] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [generatedNotes, setGeneratedNotes] = useState("")
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false)

  useEffect(() => {
    const loadMeetingData = async () => {
      setIsLoading(true)
      const data = await fetchMeetingData()
      setMeetingData(data)
      if (data.length > 0) {
        setSelectedMeetingId(data[0].id) // Select first meeting by default
      }
      setIsLoading(false)
    }
    loadMeetingData()
  }, [])

  const selectedMeeting = meetingData.find((m) => m.id === selectedMeetingId)

  const handleAddDecision = async () => {
    if (!selectedMeetingId || !newDecisionText.trim()) return
    setIsAddingDecision(true)
    const result = await addMeetingDecision(selectedMeetingId, newDecisionText)
    if (result.success) {
      toast({ title: "Decision Added", description: "New decision has been recorded." })
      setNewDecisionText("")
      // Refresh data
      const updatedData = await fetchMeetingData()
      setMeetingData(updatedData)
    } else {
      toast({ title: "Failed to Add Decision", description: result.error, variant: "destructive" })
    }
    setIsAddingDecision(false)
  }

  const handleAddActionItem = async () => {
    if (!selectedMeetingId || !newActionItemText.trim() || !newActionItemAssignee.trim()) return
    setIsAddingActionItem(true)
    const result = await addMeetingActionItem(selectedMeetingId, newActionItemText, newActionItemAssignee)
    if (result.success) {
      toast({ title: "Action Item Added", description: "New action item has been recorded." })
      setNewActionItemText("")
      setNewActionItemAssignee("")
      // Refresh data
      const updatedData = await fetchMeetingData()
      setMeetingData(updatedData)
    } else {
      toast({ title: "Failed to Add Action Item", description: result.error, variant: "destructive" })
    }
    setIsAddingActionItem(false)
  }

  const handleGenerateMeetingNotes = async () => {
    if (!selectedMeeting) {
      toast({
        title: "No Meeting Selected",
        description: "Please select a meeting to generate notes.",
        variant: "destructive",
      })
      return
    }
    setIsGeneratingNotes(true)
    const result = await generateMeetingNotes(selectedMeeting)
    if (result.success && result.notes) {
      setGeneratedNotes(result.notes)
      setShowNotesDialog(true)
      toast({ title: "Notes Generated", description: "Meeting notes template is ready." })
    } else {
      toast({
        title: "Failed to Generate Notes",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
    setIsGeneratingNotes(false)
  }

  const getDecisionStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "implemented":
        return "default"
      case "in progress":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getActionItemStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "destructive"
      case "in progress":
        return "default"
      case "closed":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
        <p className="text-muted-foreground mt-4">Loading meeting data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="decisions">Decision History</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Your Upcoming Meetings
              </CardTitle>
              <CardDescription>Meetings requiring your preparation and input</CardDescription>
            </CardHeader>
            <CardContent>
              {meetingData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No upcoming meetings found.</div>
              ) : (
                <div className="space-y-4">
                  {meetingData.map((meeting) => (
                    <div
                      key={meeting.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedMeetingId === meeting.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedMeetingId(meeting.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{meeting.title}</h3>
                        <Badge variant="outline">{meeting.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{meeting.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{meeting.attendees.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedMeeting && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Preparation for {selectedMeeting.title}
                </CardTitle>
                <CardDescription>Key information and suggested actions for this meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Decision History Summary</h4>
                  {selectedMeeting.decisionHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No prior decisions linked to this meeting.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedMeeting.decisionHistory.map((decision: any) => (
                        <div key={decision.id} className="flex items-center justify-between text-sm">
                          <span>{decision.description}</span>
                          <Badge variant={getDecisionStatusColor(decision.status)}>{decision.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Pending Action Items</h4>
                  {selectedMeeting.actionItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending action items for this meeting.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedMeeting.actionItems.map((action: any) => (
                        <div key={action.id} className="flex items-center justify-between text-sm">
                          <span>
                            {action.description} (Assigned to: {action.assignee})
                          </span>
                          <Badge variant={getActionItemStatusColor(action.status)}>{action.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    Suggested Questions / Negotiation Angles
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>What are the key blockers for the "Password Reset Flow" story?</li>
                    <li>How will the mobile app performance optimization impact user retention?</li>
                    <li>Are there any new security compliance requirements we need to consider?</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Flagged Risks / Unresolved Items
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Potential delay in API integration due to third-party dependency.</li>
                    <li>Unclear scope for "Analytics Dashboard" - needs further refinement.</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGenerateMeetingNotes}
                  disabled={isGeneratingNotes || !selectedMeeting}
                  className="w-full"
                >
                  {isGeneratingNotes ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating Notes...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Meeting Notes Template
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision History</CardTitle>
              <CardDescription>Track key decisions and their implementation status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingData.flatMap((meeting) =>
                  meeting.decisionHistory.map((decision: any) => (
                    <div key={decision.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{decision.description}</h4>
                        <Badge variant={getDecisionStatusColor(decision.status)}>{decision.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">From: {meeting.title}</p>
                    </div>
                  )),
                ).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No decisions recorded yet.</div>
                ) : (
                  meetingData.flatMap((meeting) =>
                    meeting.decisionHistory.map((decision: any) => (
                      <div key={decision.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{decision.description}</h4>
                          <Badge variant={getDecisionStatusColor(decision.status)}>{decision.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">From: {meeting.title}</p>
                      </div>
                    )),
                  )
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="new-decision">Add New Decision (for selected meeting)</Label>
                <Textarea
                  id="new-decision"
                  placeholder="Enter new decision..."
                  value={newDecisionText}
                  onChange={(e) => setNewDecisionText(e.target.value)}
                />
                <Button onClick={handleAddDecision} disabled={!selectedMeetingId || isAddingDecision}>
                  {isAddingDecision ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add Decision
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Manage pending tasks and assignees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingData.flatMap((meeting) =>
                  meeting.actionItems.map((action: any) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{action.description}</h4>
                        <Badge variant={getActionItemStatusColor(action.status)}>{action.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Assigned to: {action.assignee} • From: {meeting.title}
                      </p>
                    </div>
                  )),
                ).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No action items recorded yet.</div>
                ) : (
                  meetingData.flatMap((meeting) =>
                    meeting.actionItems.map((action: any) => (
                      <div key={action.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{action.description}</h4>
                          <Badge variant={getActionItemStatusColor(action.status)}>{action.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: {action.assignee} • From: {meeting.title}
                        </p>
                      </div>
                    )),
                  )
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="new-action-item">Add New Action Item (for selected meeting)</Label>
                <Textarea
                  id="new-action-item"
                  placeholder="Enter new action item..."
                  value={newActionItemText}
                  onChange={(e) => setNewActionItemText(e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Assignee Name"
                  value={newActionItemAssignee}
                  onChange={(e) => setNewActionItemAssignee(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleAddActionItem} disabled={!selectedMeetingId || isAddingActionItem}>
                  {isAddingActionItem ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add Action Item
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Meeting Notes</DialogTitle>
            <DialogDescription>
              Here is the fact-based summary for the selected meeting. You can copy and use it.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-muted/50 text-sm font-mono whitespace-pre-wrap">
            <pre>{generatedNotes}</pre>
          </div>
          <Button onClick={() => navigator.clipboard.writeText(generatedNotes)}>Copy to Clipboard</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
