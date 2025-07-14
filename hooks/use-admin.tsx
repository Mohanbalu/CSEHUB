"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, supabase } from "@/lib/supabase"

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAdminStatus()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus()
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (!currentUser) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single()

      setIsAdmin(profileData?.role === "admin")
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  return { isAdmin, loading, user }
}
