"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, supabase } from "@/lib/supabase"

export default function AddNotePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    description: "",
    file_url: "",
  })

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single()

      if (!profileData || profileData.role !== "admin") {
        router.push("/")
        return
      }
    } catch (error) {
      console.error("Error checking admin access:", error)
      router.push("/")
    }
  }

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

      const { error: insertError } = await supabase.from("notes").insert({
        title: formData.title,
        subject: formData.subject,
        semester: Number.parseInt(formData.semester),
        description: formData.description,
        file_url: formData.file_url,
        uploaded_by: currentUser.id,
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push("/admin/notes")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the note")
    } finally {
      setLoading(false)
    }
  }

  const subjects = ["DSA", "OOP", "DBMS", "CN", "OS", "SE", "AI/ML", "Web Dev", "Mobile Dev", "Blockchain"]

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Note Added Successfully!</h2>
            <p className="text-gray-600 mb-6">The note has been added to the platform.</p>
            <Button asChild>
              <Link href="/admin/notes">Back to Notes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/notes">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Note</h1>
            <p className="text-gray-600">Upload study materials and notes</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
            <CardDescription>Fill in the information for the new note</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter file URL (e.g., /notes/filename.pdf)"
                  required
                  disabled={loading}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Upload your file to a cloud storage service and paste the URL here
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Note...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Add Note
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/notes">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
