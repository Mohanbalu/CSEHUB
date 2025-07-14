"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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
import { Brain, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { supabase, type Quiz, type Question } from "@/lib/supabase"
import { useAdmin } from "@/hooks/use-admin"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminActions } from "@/components/admin/admin-actions"
import { QuizModal } from "@/components/modals/quiz-modal"

export default function QuizPage() {
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const [quizModal, setQuizModal] = useState({ open: false, quiz: null as Quiz | null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, quiz: null as Quiz | null })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (selectedQuiz && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0 && selectedQuiz && !showResults) {
      // Auto-submit when time runs out
      handleSubmit()
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [selectedQuiz, showResults, timeLeft])

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          profiles:created_by (
            full_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  // --- helper --------------------------------------------------
  function normalizeOptions(raw: unknown): string[] {
    /* 1. already an array */
    if (Array.isArray(raw)) return raw as string[]

    /* 2. JSON string */
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : [String(raw)]
      } catch {
        return [raw]
      }
    }

    /* 3. JSON object (e.g., { "0":"A", "1":"B" }) */
    if (raw && typeof raw === "object") {
      return Object.values(raw as Record<string, unknown>).map(String)
    }

    /* 4. fallback */
    return []
  }

  const fetchQuestions = async (quizId: string) => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("created_at", { ascending: true })

      if (error) throw error

      return (
        data?.map((q) => ({
          ...q,
          options: normalizeOptions(q.options), // <- robust coercion
        })) || []
      )
    } catch (error) {
      console.error("Error fetching questions:", error)
      return []
    }
  }

  const handleQuizStart = async (quiz: Quiz) => {
    const quizQuestions = await fetchQuestions(quiz.id)
    if (quizQuestions.length === 0) {
      alert("This quiz has no questions yet.")
      return
    }

    setSelectedQuiz(quiz)
    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(quizQuestions.length).fill(""))
    setShowResults(false)
    setTimeLeft(quiz.duration * 60)
  }

  const handleDeleteQuiz = async () => {
    if (!deleteDialog.quiz) return

    try {
      const { error } = await supabase.from("quizzes").delete().eq("id", deleteDialog.quiz.id)

      if (error) throw error

      setQuizzes(quizzes.filter((quiz) => quiz.id !== deleteDialog.quiz!.id))
      setDeleteDialog({ open: false, quiz: null })
    } catch (error) {
      console.error("Error deleting quiz:", error)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answer
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index]?.trim().toLowerCase()
      let actualCorrectAnswerText = question.correct_answer?.trim().toLowerCase()

      // If correct_answer is a single letter (e.g., 'a', 'b', 'c', 'd'), map it to the option text
      if (actualCorrectAnswerText && actualCorrectAnswerText.length === 1 && actualCorrectAnswerText.match(/[a-d]/i)) {
        const optionIndex = actualCorrectAnswerText.charCodeAt(0) - "a".charCodeAt(0)
        if (optionIndex >= 0 && optionIndex < question.options.length) {
          actualCorrectAnswerText = question.options[optionIndex]?.trim().toLowerCase()
        }
      }

      if (userAnswer === actualCorrectAnswerText) {
        correct++
      }
    })
    return correct
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (selectedQuiz && !showResults) {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">{selectedQuiz.topic} Quiz</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <Badge variant="outline">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion + 1}. {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[currentQuestion]}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext}>Next</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showResults && selectedQuiz) {
    const score = calculateScore()
    const percentage = (score / questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              <CardDescription>Here are your results for {selectedQuiz.topic}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{score}</div>
                  <div className="text-gray-600">Correct Answers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{percentage.toFixed(1)}%</div>
                  <div className="text-gray-600">Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">{questions.length}</div>
                  <div className="text-gray-600">Total Questions</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setSelectedQuiz(null)} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button onClick={() => handleQuizStart(selectedQuiz)}>Retake Quiz</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Detailed Results</h2>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              let displayCorrectAnswer = question.correct_answer

              // If correct_answer is a single letter (e.g., 'a', 'b', 'c', 'd'), map it to the option text
              if (displayCorrectAnswer && displayCorrectAnswer.length === 1 && displayCorrectAnswer.match(/[a-d]/i)) {
                const optionIndex = displayCorrectAnswer.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
                if (optionIndex >= 0 && optionIndex < question.options.length) {
                  displayCorrectAnswer = question.options[optionIndex]
                }
              }

              const isCorrect = userAnswer?.trim().toLowerCase() === displayCorrectAnswer?.trim().toLowerCase()

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 mt-1" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {index + 1}. {question.question}
                        </CardTitle>
                        <div className="mt-2 space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Your answer: </span>
                            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                              {userAnswer || "Not answered"}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="text-sm">
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-600">{displayCorrectAnswer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {question.explanation && (
                    <CardContent>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Explanation: </span>
                          {question.explanation}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Quizzes</h1>
          <p className="text-gray-600">Test your knowledge with interactive quizzes</p>
        </div>

        {isAdmin && (
          <AdminHeader
            title="Quizzes"
            description="Manage quizzes and questions"
            onAddNew={() => setQuizModal({ open: true, quiz: null })}
            addButtonText="Create Quiz"
            itemCount={quizzes.length}
          />
        )}

        {quizzes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{quiz.topic}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{quiz.subject}</Badge>
                        <Badge
                          variant={
                            quiz.difficulty === "easy"
                              ? "default"
                              : quiz.difficulty === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-6 h-6 text-blue-600" />
                      {isAdmin && (
                        <AdminActions
                          onEdit={() => setQuizModal({ open: true, quiz })}
                          onDelete={() => setDeleteDialog({ open: true, quiz })}
                          itemType="Quiz"
                        />
                      )}
                    </div>
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{quiz.duration} Minutes</span>
                      <span>Created by {(quiz as any).profiles?.full_name || "Admin"}</span>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleQuizStart(quiz)}>
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes available</h3>
            <p className="text-gray-600">
              {isAdmin
                ? "Click 'Create Quiz' above to create your first quiz."
                : "Check back later for new quizzes or contact an administrator."}
            </p>
          </div>
        )}

        <QuizModal
          open={quizModal.open}
          onOpenChange={(open) => setQuizModal({ open, quiz: null })}
          quiz={quizModal.quiz}
          onSuccess={fetchQuizzes}
        />

        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, quiz: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the quiz "{deleteDialog.quiz?.topic}" and all
                its questions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteQuiz} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
