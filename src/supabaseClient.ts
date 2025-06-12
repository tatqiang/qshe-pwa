// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// ดึงค่า URL และ Anon Key จาก Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ตรวจสอบว่ามีค่าครบถ้วนหรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env file");
}

// สร้างและ export client ของ Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);