// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // ถ้าไม่มี user (ยังไม่ล็อกอิน)
    // ให้ "เด้ง" ไปที่หน้า /login
    // และจำหน้าปัจจุบันไว้ใน state เพื่อว่าหลังจากล็อกอินสำเร็จ จะได้เด้งกลับมาถูก
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ถ้าล็อกอินแล้ว ก็ให้แสดงผลหน้าที่ต้องการได้เลย
  return children;
};

export default ProtectedRoute;