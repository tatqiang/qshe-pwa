// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material';

// Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Pages and Layout Components
import Layout from './components/Layout'; // Your main UI shell (Sidebar, Navbar etc.)
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import IncidentReportPage from './pages/IncidentReport';
import ProjectSelectPage from './pages/ProjectSelect'; // The new page

const theme = createTheme();

// --- Guard Components ---

// This guard checks if the user is logged in.
// If not, it redirects to /login. Otherwise, it renders the child routes.
function AuthGuard() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

// This guard checks if a project is selected.
// It will wrap the main application layout.
function ProjectGuard() {
  const { project } = useAuth();

  if (!project) {
    // If no project is selected, redirect to the selection page.
    return <Navigate to="/project-selection" replace />;
  }
  
  // If a project is selected, render the main Layout component,
  // which will then render the specific page (e.g., Dashboard).
  return <Layout />; 
}

// --- Router Definition ---

const router = createBrowserRouter([
  // --- Public Routes ---
  // These routes are accessible to everyone.
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // --- Protected Routes ---
  // All routes inside here are protected by the AuthGuard.
  // A user MUST be logged in to access any of these.
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/project-selection",
        element: <ProjectSelectPage />,
      },
      {
        // This is the main application layout, doubly protected by the ProjectGuard.
        // A user MUST be logged in AND have a project selected to access these pages.
        path: "/",
        element: <ProjectGuard />,
        children: [
          // Redirect the root "/" path to "/dashboard"
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", element: <DashboardPage /> },
          { path: "incident-report", element: <IncidentReportPage /> },
        ]
      },
    ]
  }
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
