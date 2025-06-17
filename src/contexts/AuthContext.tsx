// src/contexts/AuthContext.tsx
import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient'; // ตรวจสอบว่า path ถูกต้อง
import { Session, User } from '@supabase/supabase-js';

// --- เพิ่ม: 1. สร้าง Type สำหรับ Project ---
// เราสามารถเพิ่มรายละเอียดได้ในอนาคต
export interface ProjectType {
  id: string;
  name: string;
  location?: string;
}

// --- แก้ไข: 2. เพิ่ม Project และ setProject เข้าไปใน Context Type ---
interface AuthContextType {
  user: User | null;
  session: Session | null;
  project: ProjectType | null; // <-- เพิ่ม state ของ project
  setProject: (project: ProjectType | null) => void; // <-- เพิ่ม function สำหรับ set project
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // --- เพิ่ม: 3. สร้าง State สำหรับ Project ---
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // โค้ดส่วนนี้เหมือนเดิม
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // --- เพิ่ม: ถ้า user ออกจากระบบ ให้เคลียร์ project ด้วย ---
        if (event === "SIGNED_OUT") {
          setProject(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // ฟังก์ชันเดิม
  const signUp = (email: string, password: string, firstName: string, lastName: string) => {
    return supabase.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName } } });
  };

  const signInWithPassword = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = () => {
    return supabase.auth.signOut();
  };
  
  // --- แก้ไข: 4. เพิ่ม project และ setProject เข้าไปใน value ---
  const value: AuthContextType = {
    signUp,
    signInWithPassword,
    signOut,
    user,
    session,
    project, // <-- ส่ง project state ออกไป
    setProject, // <-- ส่ง function setProject ออกไป
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
