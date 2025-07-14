"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Play, Users, Plus, FileText, UserCheck, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, supabase } from "@/lib/supabase"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalQuizzes: 0,
    totalVideos: 0,
    totalUsers: 0,
    recentSignups: 0,
    totalDownloads: 0,
  })

  useEffect(() => {
    checkAdminAccess()
    fetchStats()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()

      if (!profileData || profileData.role !== "admin") {
        router.push("/")
        return
      }

      setUser(currentUser)
      setProfile(profileData)
    } catch (error) {
      console.error("Error checking admin access:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [notesCount, quizzesCount, videosCount, usersCount] = await Promise.all([
        supabase.from("notes").select("*", { count: "exact", head: true }),
        supabase.from("quizzes").select("*", { count: "exact", head: true }),
        supabase.from("videos").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ])

      // Get total downloads
      const { data: notesData } = await supabase.from("notes").select("downloads")

      const totalDownloads = notesData?.reduce((sum, note) => sum + (note.downloads || 0), 0) || 0

      // Get recent signups (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: recentSignups } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString())

      setStats({
        totalNotes: notesCount.count || 0,
        totalQuizzes: quizzesCount.count || 0,
        totalVideos: videosCount.count || 0,
        totalUsers: usersCount.count || 0,
        recentSignups: recentSignups || 0,
        totalDownloads,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const quickActions = [
    {
      title: "Add New Note",
      description: "Upload study materials and notes",
      icon: BookOpen,
      href: "/admin/notes/new",
      color: "bg-blue-500",
    },
    {
      title: "Create Quiz",
      description: "Build interactive quizzes",
      icon: Brain,
      href: "/admin/quizzes/new",
      color: "bg-green-500",
    },
    {
      title: "Add Video",
      description: "Upload video lectures",
      icon: Play,
      href: "/admin/videos/new",
      color: "bg-red-500",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500",
    },
  ]

  const managementSections = [
    {
      title: "Notes Management",
      description: "Manage study notes and materials",
      icon: FileText,
      href: "/admin/notes",
      count: stats.totalNotes,
    },
    {
      title: "Quiz Management",
      description: "Create and manage quizzes",
      icon: Brain,
      href: "/admin/quizzes",
      count: stats.totalQuizzes,
    },
    {
      title: "Video Management",
      description: "Manage video lectures",
      icon: Play,
      href: "/admin/videos",
      count: stats.totalVideos,
    },
    {
      title: "User Management",
      description: "Manage user accounts and roles",
      icon: UserCheck,
      href: "/admin/users",
      count: stats.totalUsers,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name}! Manage your platform content and users.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notes</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalNotes}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalQuizzes}</p>
                </div>
                <Brain className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Videos</p>
                  <p className="text-3xl font-bold text-red-600">{stats.totalVideos}</p>
                </div>
                <Play className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Quickly add new content to your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow bg-transparent"
                >
                  <Link href={action.href}>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-600">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {managementSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <section.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{section.count}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={section.href}>Manage {section.title.split(" ")[0]}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Platform Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Downloads</span>
                  <span className="font-semibold">{stats.totalDownloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Users (7 days)</span>
                  <span className="font-semibold">{stats.recentSignups}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Content</span>
                  <span className="font-semibold">{stats.totalNotes + stats.totalQuizzes + stats.totalVideos}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most Popular Subject</span>
                  <Badge>DSA</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Quiz Score</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Content Growth</span>
                  <span className="font-semibold text-green-600">+12% this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
