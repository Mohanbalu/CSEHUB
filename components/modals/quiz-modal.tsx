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
import { supabase, getCurrentUser, type Quiz } from "@/lib/supabase"

interface QuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quiz?: Quiz | null
  onSuccess: () => void
}

export function QuizModal({ open, onOpenChange, quiz, onSuccess }: QuizModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    topic: "",
    subject: "",
    description: "",
    duration: "",
    difficulty: "",
  })

  const subjects = ["DSA", "OOP", "DBMS", "CN", "OS", "SE", "AI/ML", "Web Dev", "Mobile Dev", "Blockchain"]

  useEffect(() => {
    if (quiz) {
      setFormData({
        topic: quiz.topic,
        subject: quiz.subject,
        description: quiz.description || "",
        duration: quiz.duration.toString(),
        difficulty: quiz.difficulty,
      })
    } else {
      setFormData({
        topic: "",
        subject: "",
        description: "",
        duration: "",
        difficulty: "",
      })
    }
    setError("")
  }, [quiz, open])

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

      const quizData = {
        topic: formData.topic,
        subject: formData.subject,
        description: formData.description,
        duration: Number.parseInt(formData.duration),
        difficulty: formData.difficulty as "easy" | "medium" | "hard",
      }

      if (quiz) {
        // Update existing quiz
        const { error: updateError } = await supabase.from("quizzes").update(quizData).eq("id", quiz.id)
        if (updateError) throw updateError
      } else {
        // Create new quiz
        const { error: insertError } = await supabase
          .from("quizzes")
          .insert({ ...quizData, created_by: currentUser.id })
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
          <DialogTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
          <DialogDescription>
            {quiz ? "Update the quiz information below." : "Fill in the details for the new quiz."}
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
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
                placeholder="Enter quiz topic"
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
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => handleInputChange("difficulty", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="Enter duration in minutes"
                min="1"
                max="180"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
                disabled={loading}
              />
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
                  {quiz ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{quiz ? "Update Quiz" : "Create Quiz"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
