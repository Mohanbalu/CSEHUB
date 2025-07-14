"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Code, FileText, Briefcase, GraduationCap } from "lucide-react"
import Link from "next/link"

// Static resources - these could be moved to database later if needed
const resourceCategories = [
  {
    title: "Placement Preparation",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600",
    resources: [
      {
        name: "Top 100 Coding Interview Questions",
        description: "Curated list of most asked coding questions in technical interviews",
        type: "PDF",
        link: "#",
        tags: ["Interview", "Coding"],
      },
      {
        name: "System Design Interview Guide",
        description: "Complete guide to crack system design interviews at top tech companies",
        type: "PDF",
        link: "#",
        tags: ["System Design", "Interview"],
      },
      {
        name: "Resume Templates for CSE Students",
        description: "Professional resume templates optimized for software engineering roles",
        type: "Template",
        link: "#",
        tags: ["Resume", "Template"],
      },
    ],
  },
  {
    title: "Programming Resources",
    icon: Code,
    color: "bg-green-100 text-green-600",
    resources: [
      {
        name: "Data Structures Implementation",
        description: "Complete implementation of all data structures in C++, Java, and Python",
        type: "Code",
        link: "#",
        tags: ["DSA", "Implementation"],
      },
      {
        name: "Algorithm Visualization Tools",
        description: "Interactive tools to visualize sorting and searching algorithms",
        type: "Tool",
        link: "#",
        tags: ["Algorithms", "Visualization"],
      },
      {
        name: "Competitive Programming Guide",
        description: "Step-by-step guide to excel in competitive programming contests",
        type: "PDF",
        link: "#",
        tags: ["CP", "Contest"],
      },
    ],
  },
  {
    title: "Academic Support",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-600",
    resources: [
      {
        name: "Previous Year Question Papers",
        description: "Collection of previous year exam papers for all CSE subjects",
        type: "PDF",
        link: "#",
        tags: ["Exam", "Papers"],
      },
      {
        name: "Lab Manual Solutions",
        description: "Complete solutions for all CSE lab experiments and assignments",
        type: "PDF",
        link: "#",
        tags: ["Lab", "Solutions"],
      },
      {
        name: "Project Ideas and Implementation",
        description: "Innovative project ideas with complete implementation guides",
        type: "Guide",
        link: "#",
        tags: ["Projects", "Ideas"],
      },
    ],
  },
  {
    title: "Reference Materials",
    icon: FileText,
    color: "bg-orange-100 text-orange-600",
    resources: [
      {
        name: "Quick Reference Cheat Sheets",
        description: "Handy cheat sheets for programming languages and concepts",
        type: "PDF",
        link: "#",
        tags: ["Cheat Sheet", "Reference"],
      },
      {
        name: "Important Formulas and Theorems",
        description: "Mathematical formulas and computer science theorems compilation",
        type: "PDF",
        link: "#",
        tags: ["Formulas", "Math"],
      },
      {
        name: "Industry Best Practices",
        description: "Coding standards and best practices followed in the industry",
        type: "Guide",
        link: "#",
        tags: ["Best Practices", "Industry"],
      },
    ],
  },
]

const externalLinks = [
  {
    name: "LeetCode",
    description: "Practice coding problems and prepare for technical interviews",
    url: "https://leetcode.com",
    category: "Coding Practice",
  },
  {
    name: "GeeksforGeeks",
    description: "Computer science portal with tutorials, articles, and practice problems",
    url: "https://geeksforgeeks.org",
    category: "Learning",
  },
  {
    name: "HackerRank",
    description: "Coding challenges and skill assessment platform",
    url: "https://hackerrank.com",
    category: "Coding Practice",
  },
  {
    name: "Coursera",
    description: "Online courses from top universities and companies",
    url: "https://coursera.org",
    category: "Online Learning",
  },
  {
    name: "GitHub",
    description: "Version control and collaborative development platform",
    url: "https://github.com",
    category: "Development",
  },
  {
    name: "Stack Overflow",
    description: "Q&A platform for programming and development questions",
    url: "https://stackoverflow.com",
    category: "Community",
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Resources</h1>
          <p className="text-gray-600">Comprehensive collection of study materials, tools, and career resources</p>
        </div>

        {/* Note about admin management */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> These resources are currently static. Administrators can manage downloadable
            resources through the admin panel once the resource management system is implemented.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="space-y-8">
          {resourceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.resources.map((resource, resourceIndex) => (
                  <Card key={resourceIndex} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{resource.name}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{resource.type}</Badge>
                            {resource.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" disabled>
                          <Download className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* External Links Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Useful External Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{link.name}</CardTitle>
                      <Badge variant="outline" className="mb-2">
                        {link.category}
                      </Badge>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={link.url} target="_blank" rel="noopener noreferrer">
                      Visit Site
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Something Specific?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Contact our academic support team or join our community for
              personalized help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Contact Support</Button>
              <Button size="lg" variant="outline">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
