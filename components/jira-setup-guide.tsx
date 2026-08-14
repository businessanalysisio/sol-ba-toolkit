"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Database, Loader2, RefreshCw, ShieldAlert } from "lucide-react"
import { getJiraConnectionStatus, syncWithJira } from "@/app/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface JiraSetupGuideProps {
  onComplete?: () => void
}

interface ConnectionStatus {
  connected: boolean
  user?: string
  instance?: string
  project?: string
  error?: string
}

interface SyncResult {
  success: boolean
  message?: string
  error?: string
}

export default function JiraSetupGuide({ onComplete }: JiraSetupGuideProps) {
  const [connection, setConnection] = useState<ConnectionStatus | null>(null)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  async function checkConnection() {
    setIsChecking(true)
    setSyncResult(null)
    try {
      setConnection(await getJiraConnectionStatus())
    } catch {
      setConnection({ connected: false, error: "Unable to check Jira configuration." })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    void checkConnection()
  }, [])

  async function performSync() {
    setIsSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncWithJira()
      setSyncResult(result)
      if (result.success) onComplete?.()
    } catch {
      setSyncResult({ success: false, error: "Jira synchronization failed." })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Database className="h-7 w-7 text-blue-600" />
          <h1 className="text-3xl font-bold">Jira integration</h1>
        </div>
        <p className="text-muted-foreground">
          Configure credentials on the server, verify the connection, and synchronize project data.
        </p>
      </div>

      <Alert>
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          Jira credentials are never entered or stored in the browser. Set JIRA_BASE_URL, JIRA_EMAIL,
          JIRA_API_TOKEN, and JIRA_PROJECT_KEY in the server environment.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Connection status</CardTitle>
              <CardDescription>Sol checks Jira directly from the server.</CardDescription>
            </div>
            {connection && (
              <Badge variant={connection.connected ? "default" : "secondary"}>
                {connection.connected ? "Connected" : "Not connected"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isChecking ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking connection…
            </div>
          ) : connection?.connected ? (
            <div className="space-y-2 rounded-lg border bg-muted/40 p-4 text-sm">
              <p className="flex items-center gap-2 font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4" /> Connected as {connection.user ?? "Jira user"}
              </p>
              <p><span className="text-muted-foreground">Instance:</span> {connection.instance}</p>
              <p><span className="text-muted-foreground">Project:</span> {connection.project}</p>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                {connection?.error ?? "Jira is not configured. Add the required server environment variables."}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={checkConnection} disabled={isChecking || isSyncing}>
              <RefreshCw className="mr-2 h-4 w-4" /> Check again
            </Button>
            <Button onClick={performSync} disabled={!connection?.connected || isChecking || isSyncing}>
              {isSyncing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Synchronize now
            </Button>
          </div>

          {syncResult && (
            <Alert variant={syncResult.success ? "default" : "destructive"}>
              <AlertDescription>
                {syncResult.message ?? syncResult.error ?? "Synchronization completed."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
