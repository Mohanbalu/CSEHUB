"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Download, BookOpen, Calendar, User } from "lucide-react"
import { supabase, type Note } from "@/lib/supabase"
import { useAdmin } from "@/hooks/use-admin"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminActions } from "@/components/admin/admin-actions"
import { NoteModal } from "@/components/modals/note-modal"
import Link from "next/link"

export default function NotesPage() {
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [noteModal, setNoteModal] = useState({ open: false, note: null as Note | null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, note: null as Note | null })

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    filterNotes()
  }, [notes, searchTerm, selectedSemester, selectedSubject])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          profiles:uploaded_by (
            full_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = notes

    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedSemester !== "all") {
      filtered = filtered.filter((note) => note.semester.toString() === selectedSemester)
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((note) => note.subject === selectedSubject)
    }

    setFilteredNotes(filtered)
  }

  const handleDownload = async (noteId: string) => {
    try {
      const note = notes.find((n) => n.id === noteId)
      if (note) {
        const { error } = await supabase
          .from("notes")
          .update({ downloads: note.downloads + 1 })
          .eq("id", noteId)

        if (!error) {
          setNotes(notes.map((n) => (n.id === noteId ? { ...n, downloads: n.downloads + 1 } : n)))
        }
      }
    } catch (error) {
      console.error("Error updating download count:", error)
    }
  }

  const handleDeleteNote = async () => {
    if (!deleteDialog.note) return

    try {
      const { error } = await supabase.from("notes").delete().eq("id", deleteDialog.note.id)

      if (error) throw error

      setNotes(notes.filter((note) => note.id !== deleteDialog.note!.id))
      setDeleteDialog({ open: false, note: null })
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const subjects = [...new Set(notes.map((note) => note.subject))]
  const semesters = [...new Set(notes.map((note) => note.semester))].sort()

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Notes</h1>
          <p className="text-gray-600">Access comprehensive notes organized by semester and subject</p>
        </div>

        {/* Admin Header */}
        {isAdmin && (
          <AdminHeader
            title="Notes"
            description="Manage study notes and materials"
            onAddNew={() => setNoteModal({ open: true, note: null })}
            addButtonText="Add Note"
            itemCount={notes.length}
          />
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedSemester("all")
                setSelectedSubject("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Semester {note.semester}</Badge>
                      <Badge variant="outline">{note.subject}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    {isAdmin && (
                      <AdminActions
                        onEdit={() => setNoteModal({ open: true, note })}
                        onDelete={() => setDeleteDialog({ open: true, note })}
                        itemType="Note"
                      />
                    )}
                  </div>
                </div>
                <CardDescription className="text-sm">{note.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{(note as any).profiles?.full_name || "Unknown"}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{note.downloads} downloads</span>
                    <Link
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDownload(note.id)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-primary-foreground hover:bg-blue-700 h-9 px-3"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600">
              {isAdmin
                ? "Click 'Add Note' above to create your first note."
                : "Try adjusting your search criteria or check back later."}
            </p>
          </div>
        )}

        {/* Note Modal */}
        <NoteModal
          open={noteModal.open}
          onOpenChange={(open) => setNoteModal({ open, note: null })}
          note={noteModal.note}
          onSuccess={fetchNotes}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, note: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note "{deleteDialog.note?.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteNote} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
