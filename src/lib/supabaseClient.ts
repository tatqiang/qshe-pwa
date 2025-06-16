// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// แก้ไขตรงนี้: ใช้ import.meta.env และ Key ต้องขึ้นต้นด้วย VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ตรวจสอบว่าค่าที่ได้ไม่เป็นค่าว่าง
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env.local file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)