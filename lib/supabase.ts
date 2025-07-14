import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  email: string
  full_name: string
  role: "student" | "admin"
  semester?: number
  college?: string
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  title: string
  subject: string
  semester: number
  description?: string
  file_url: string
  uploaded_by: string
  downloads: number
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  topic: string
  subject: string
  description?: string
  duration: number
  difficulty: "easy" | "medium" | "hard"
  created_by: string
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  quiz_id: string
  question: string
  options: string[]
  correct_answer: string
  explanation?: string
  created_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  answers: Record<string, string>
  completed_at: string
}

export interface Video {
  id: string
  title: string
  subject: string
  description?: string
  youtube_id?: string
  duration?: string
  views: number
  level: "beginner" | "intermediate" | "advanced"
  created_by: string
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: "general" | "urgent" | "event"
  created_by: string
  created_at: string
  updated_at: string
}

// Authentication functions
export async function signUp(
  email: string,
  password: string,
  userData: {
    full_name: string
    semester?: number
    college?: string
  },
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Returns the current authenticated user or null if no session exists.
// Throws only when Supabase itself returns an unexpected error.
export async function getCurrentUser() {
  // 1. Get the current session (light-weight, never errors when session is absent)
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) throw sessionError // real Supabase error
  if (!session) return null // no logged-in user

  // 2. Extract user safely
  return session.user ?? null
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}
