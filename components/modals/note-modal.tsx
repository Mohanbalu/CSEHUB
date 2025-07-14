"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { supabase, getCurrentUser, type Note } from "@/lib/supabase"

interface NoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note?: Note | null
  onSuccess: () => void
}

export function NoteModal({ open, onOpenChange, note, onSuccess }: NoteModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    description: "",
    file_url: "",
  })

  const subjects = ["DSA", "OOP", "DBMS", "CN", "OS", "SE", "AI/ML", "Web Dev", "Mobile Dev", "Blockchain"]

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        subject: note.subject,
        semester: note.semester.toString(),
        description: note.description || "",
        file_url: note.file_url,
      })
    } else {
      setFormData({
        title: "",
        subject: "",
        semester: "",
        description: "",
        file_url: "",
      })
    }
    setError("")
  }, [note, open])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) throw new Error("Not authenticated")

      const noteData = {
        title: formData.title,
        subject: formData.subject,
        semester: Number.parseInt(formData.semester),
        description: formData.description,
        file_url: formData.file_url,
      }

      if (note) {
        // Update existing note
        const { error: updateError } = await supabase.from("notes").update(noteData).eq("id", note.id)
        if (updateError) throw updateError
      } else {
        // Create new note
        const { error: insertError } = await supabase.from("notes").insert({ ...noteData, uploaded_by: currentUser.id })
        if (insertError) throw insertError
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "Add New Note"}</DialogTitle>
          <DialogDescription>
            {note ? "Update the note information below." : "Fill in the details for the new note."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter note title"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange("subject", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => handleInputChange("semester", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter note description"
                rows={3}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="file_url">File URL *</Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => handleInputChange("file_url", e.target.value)}
                placeholder="Enter file URL"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-600 mt-1">Upload your file to cloud storage and paste the URL here</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {note ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{note ? "Update Note" : "Create Note"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
