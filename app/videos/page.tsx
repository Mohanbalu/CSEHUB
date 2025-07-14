"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Clock, Eye, BookOpen, Search } from "lucide-react"
import { supabase, type Video } from "@/lib/supabase"

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  useEffect(() => {
    fetchVideos()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [videos, searchTerm, selectedSubject, selectedLevel])

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          profiles:created_by (
            full_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterVideos = () => {
    let filtered = videos

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          video.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
          video.description?.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    if (selectedSubject !== "all") {
      const lowerCaseSelectedSubject = selectedSubject.toLowerCase().trim()
      filtered = filtered.filter((video) => video.subject.toLowerCase().trim() === lowerCaseSelectedSubject)
    }

    if (selectedLevel !== "all") {
      const lowerCaseSelectedLevel = selectedLevel.toLowerCase().trim()
      filtered = filtered.filter((video) => video.level.toLowerCase().trim() === lowerCaseSelectedLevel)
    }

    setFilteredVideos(filtered)
  }

  const handleViewIncrement = async (videoId: string) => {
    try {
      const video = videos.find((v) => v.id === videoId)
      if (video) {
        const { error } = await supabase
          .from("videos")
          .update({ views: video.views + 1 })
          .eq("id", videoId)

        if (!error) {
          setVideos(videos.map((v) => (v.id === videoId ? { ...v, views: v.views + 1 } : v)))
        }
      }
    } catch (error) {
      console.error("Error updating view count:", error)
    }
  }

  const getYouTubeWatchUrl = (youtubeId: string) => {
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  const subjects = [...new Set(videos.map((video) => video.subject))]

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Lectures</h1>
          <p className="text-gray-600">Learn from comprehensive video tutorials covering all CSE topics</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedSubject("all")
                setSelectedLevel("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {video.youtube_id ? (
                    <Link
                      href={getYouTubeWatchUrl(video.youtube_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleViewIncrement(video.id)}
                      className="aspect-video bg-gray-200 flex items-center justify-center group"
                    >
                      {/* Placeholder image for YouTube thumbnail */}
                      <img
                        src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                        alt={`Thumbnail for ${video.title}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="lg"
                        className="absolute rounded-full w-12 h-12 bg-black/50 group-hover:bg-black/70 transition-colors"
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-500">
                      No Video Available
                    </div>
                  )}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">{video.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{video.subject}</Badge>
                        <Badge
                          variant={
                            video.level === "beginner"
                              ? "default"
                              : video.level === "intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {video.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                    {video.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{video.duration}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    asChild // Use asChild to pass props to Link
                  >
                    {video.youtube_id ? (
                      <Link
                        href={getYouTubeWatchUrl(video.youtube_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleViewIncrement(video.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Video
                      </Link>
                    ) : (
                      <Button disabled>
                        <Play className="w-4 h-4 mr-2" />
                        Video Not Available
                      </Button>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos available</h3>
            <p className="text-gray-600">Check back later for new video lectures or contact an administrator.</p>
          </div>
        )}

        {/* Categories Section - Only show if there are videos */}
        {videos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => {
                const count = videos.filter((v) => v.subject === subject).length
                return (
                  <Card
                    key={subject}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedSubject(subject)
                      setSearchTerm("") // Clear search term when selecting a category
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold">{subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{count} videos</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
