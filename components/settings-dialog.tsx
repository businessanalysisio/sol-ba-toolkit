"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { setCookie } from "cookies-next"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [apiKey, setApiKey] = React.useState("")
  const { toast } = useToast()

  React.useEffect(() => {
    // Attempt to load API key from cookie when dialog opens
    if (open) {
      const storedKey = document.cookie
        .split("; ")
        .find((row) => row.startsWith("google_ai_api_key="))
        ?.split("=")[1]
      if (storedKey) {
        setApiKey(storedKey)
      }
    }
  }, [open])

  const handleSave = () => {
    if (apiKey.trim()) {
      setCookie("google_ai_api_key", apiKey.trim(), { maxAge: 60 * 60 * 24 * 365, path: "/" }) // Store for 1 year
      toast({
        title: "Success",
        description: "API Key saved successfully!",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Error",
        description: "API Key cannot be empty.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your application settings here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              Google AI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter your Google AI Studio API Key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
