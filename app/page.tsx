import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Play, Users, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master CSE with
                <span className="text-blue-600"> Smart Learning</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Access comprehensive notes, interactive quizzes, video lectures, and academic support - all in one
                platform designed for Computer Science students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/notes">Explore Notes</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/quiz">Take Quiz</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>5000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>200+ Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>100+ Quizzes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Students learning"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning resources designed specifically for Computer Science Engineering students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Organized Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Semester-wise categorized notes with easy download and search functionality
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Interactive Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Topic-wise MCQs with instant results and detailed explanations</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Video Lectures</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Curated video content covering all major CSE topics and concepts</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Career Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Placement preparation, resume templates, and interview guidance</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Study Notes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Practice Quizzes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Video Lectures</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Student"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-sm text-gray-600">CSE 3rd Year</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The organized notes and quizzes helped me score 9.2 CGPA. The platform is incredibly user-friendly!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Student"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">Rahul Kumar</div>
                    <div className="text-sm text-gray-600">CSE 4th Year</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Got placed in Google thanks to the comprehensive placement preparation resources available here."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Student"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">Anita Patel</div>
                    <div className="text-sm text-gray-600">CSE 2nd Year</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The video lectures are amazing! Complex topics are explained in such a simple way."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Excel in Your CSE Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using our platform to achieve academic excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/notes">Browse Notes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
