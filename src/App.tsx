// src/App.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout'; // Import UI Layout จริง

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // 1. ตรวจสอบสิทธิ์
  if (!user) {
    // ถ้ายังไม่ Login, ให้เด้งไปหน้า /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. ถ้า Login แล้ว, ให้แสดง Layout เพื่อให้ Layout จัดการ UI ต่อไป
  return <Layout />;
}

export default App;