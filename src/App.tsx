// src/App.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout'; // Import Layout ที่มี UI จริงๆ

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // ตรวจสอบ: ถ้ายังไม่มี user (ยังไม่ Login)
  if (!user) {
    // ให้เด้งไปหน้า login และจำหน้าที่พยายามจะเข้าไว้
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ถ้า Login แล้ว ให้แสดง Layout ที่มี AppBar, Drawer ฯลฯ
  return <Layout />;
}

export default App;