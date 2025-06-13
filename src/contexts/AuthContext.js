// src/contexts/AuthContext.js
import React, { useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ดึง session ที่มีอยู่ตอนโหลดแอปครั้งแรก
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // lắng nghe การเปลี่ยนแปลงสถานะของ auth เช่น login, logout
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // นี่คือฟังก์ชันที่เราจะเรียกจากหน้า UI
  const signUp = (email, password, firstName, lastName) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })
  }
  
  // เราจะเพิ่มฟังก์ชัน login และ logout ที่นี่ในอนาคต

  const value = {
    signUp,
    // login,
    // logout,
    user,
    session,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}