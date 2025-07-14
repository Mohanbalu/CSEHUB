"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Search, Plus, MoreHorizontal, Edit, Trash2, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, supabase, type Note } from "@/lib/supabase"

export default function AdminNotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

  useEffect(() => {
    checkAdminAccess()
    fetchNotes()
  }, [])

  useEffect(() => {
    filterNotes()
  }, [notes, searchTerm, selectedSemester, selectedSubject])

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

  const handleDeleteNote = async () => {
    if (!noteToDelete) return

    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteToDelete.id)

      if (error) throw error

      setNotes(notes.filter((note) => note.id !== noteToDelete.id))
      setDeleteDialogOpen(false)
      setNoteToDelete(null)
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const subjects = [...new Set(notes.map((note) => note.subject))]
  const semesters = [...new Set(notes.map((note) => note.semester))].sort()

  if (loading) {
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notes Management</h1>
              <p className="text-gray-600">Manage study notes and materials</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/notes/new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Note
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
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
                  <SelectValue placeholder="All Semesters" />
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
                  <SelectValue placeholder="All Subjects" />
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
          </CardContent>
        </Card>

        {/* Notes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Notes ({filteredNotes.length})</CardTitle>
            <CardDescription>Manage your study notes and materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{note.title}</div>
                          {note.description && (
                            <div className="text-sm text-gray-600 truncate max-w-xs">{note.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{note.subject}</Badge>
                      </TableCell>
                      <TableCell>Semester {note.semester}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-gray-400" />
                          {note.downloads}
                        </div>
                      </TableCell>
                      <TableCell>{(note as any).profiles?.full_name || "Unknown"}</TableCell>
                      <TableCell>{new Date(note.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/notes/edit/${note.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setNoteToDelete(note)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No notes found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note "{noteToDelete?.title}".
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
