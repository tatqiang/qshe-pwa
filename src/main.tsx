import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from './pages/DashboardPage.tsx';
import IncidentReportPage from './pages/IncidentReportPage.tsx';

// These imports are already correct in your file
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* FIX: Wrap RouterProvider with LocalizationProvider */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
    </LocalizationProvider>
  </React.StrictMode>,
)