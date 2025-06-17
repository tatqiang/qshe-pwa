// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import Pages and Layouts
import Layout from './components/Layout';
import ProjectSelect from './pages/ProjectSelect';
import Login from './pages/Login';
import Register from './pages/Register'; // สมมติว่ามีหน้านี้

/**
 * Component นี้ทำหน้าที่ตรวจสอบว่าผู้ใช้ Login แล้วหรือยัง
 * ถ้ายังไม่ Login จะถูกส่งไปหน้า /login
 */
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // ส่งกลับไปหน้า login พร้อมกับจำหน้าที่กำลังจะไปไว้ด้วย
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Component นี้ทำหน้าที่ตรวจสอบว่าผู้ใช้ได้เลือกโปรเจกต์แล้วหรือยัง
 * จะทำงานก็ต่อเมื่อผู้ใช้ Login แล้วเท่านั้น
 * ถ้ายังไม่ได้เลือกโปรเจกต์ จะถูกส่งไปหน้า /project-selection
 */
function ProjectSelectedGuard({ children }: { children: JSX.Element }) {
  const { project } = useAuth();

  if (!project) {
    // ถ้ายังไม่เลือกโปรเจกต์ ให้ไปหน้าเลือกโปรเจกต์
    return <Navigate to="/project-selection" replace />;
  }

  return children;
}


function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ===== Public Routes ===== */}
      {/* ผู้ใช้ที่ยังไม่ Login จะเห็นหน้านี้ได้ */}
      {/* ถ้า Login แล้วพยายามเข้า /login จะถูกส่งไป /project-selection แทน */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/project-selection" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/project-selection" replace />} 
      />

      {/* ===== Protected Routes (ต้อง Login) ===== */}
      <Route
        path="/project-selection"
        element={
          <ProtectedRoute>
            <ProjectSelect />
          </ProtectedRoute>
        }
      />

      {/* ===== Main App Layout (ต้อง Login และ ต้องเลือก Project) =====
        ใช้ "/*" เพื่อบอกว่า path อื่นๆ ทั้งหมดที่ยังไม่ถูกกำหนดไว้ข้างบน
        จะถูกจัดการโดย Layout Component นี้
      */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProjectSelectedGuard>
              <Layout />
            </ProjectSelectedGuard>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
