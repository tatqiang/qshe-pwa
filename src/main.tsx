// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Pages and Layout Components
import App from './App.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';
import DashboardPage from './pages/Dashboard.tsx';
import IncidentReportPage from './pages/IncidentReport.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App คือ "ยามเฝ้าประตู" สำหรับหน้าส่วนตัว
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "incident-report",
        element: <IncidentReportPage />,
      },
    ],
  },
  // หน้าสาธารณะ (Public Routes)
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </AuthProvider>
  </React.StrictMode>,
);