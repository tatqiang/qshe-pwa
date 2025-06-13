// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// ดึงค่าจาก Environment Variables เพื่อความปลอดภัย
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// สร้างและ export client ออกไปเพื่อให้ไฟล์อื่นเรียกใช้ได้
export const supabase = createClient(supabaseUrl, supabaseAnonKey)