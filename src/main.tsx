// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// --- Providers (ครอบที่นี่!) ---
import { AuthProvider } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// --- Pages and Layout Components ---
import App from './App.tsx'; // App จะทำหน้าที่เป็น "กรอบ" ของหน้าที่ต้อง Login
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';
import DashboardPage from './pages/Dashboard.tsx';
import IncidentReportPage from './pages/IncidentReport.tsx';


// --- สร้างแผนที่ของแอป (Router) ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // ถ้าเข้า path ที่ขึ้นต้นด้วย / ให้ใช้ App เป็นกรอบ
    children: [
      // หน้าลูกๆ ที่จะแสดงในกรอบของ App
      {
        index: true, // ถ้าเป็น path "/" เฉยๆ ให้แสดง Dashboard
        element: <DashboardPage />,
      },
      {
        path: "incident-report",
        element: <IncidentReportPage />,
      },
    ],
  },
  // --- หน้านอกกรอบ (หน้าที่ไม่ต้อง Login) ---
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

// --- Render แอปพลิเคชัน ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* AuthProvider จะครอบ RouterProvider อีกที */}
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </AuthProvider>
  </React.StrictMode>,
);