// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1. Import your new pages
import DashboardPage from './pages/DashboardPage.tsx';
import IncidentReportPage from './pages/IncidentReportPage.tsx';

// 2. Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App now acts as the layout for child routes
    children: [
      {
        index: true, // This makes it the default child route
        element: <DashboardPage />,
      },
      {
        path: "incident-report",
        element: <IncidentReportPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Provide the router to your app */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)