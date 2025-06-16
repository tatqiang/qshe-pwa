// src/components/Layout.tsx
import React from 'react';
import { Routes, Outlet, Route, useNavigate } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';

import ProtectedRoute from './ProtectedRoute'; // อยู่ในโฟลเดอร์เดียวกัน
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import IncidentReport from '../pages/IncidentReport';
import Login from '../pages/Login'; // อันนี้อาจจะถูกแล้ว
import Register from '../pages/Register'; // เราจะเปลี่ยนเป็น .tsx ต่อ


const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/* ... ListItemButtons for Dashboard, Incident Report ... */}
         <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/incident-report')}>
            <ListItemIcon><ReportIcon /></ListItemIcon>
            <ListItemText primary="Incident Report" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {user && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              QSHE Management
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {user && (
        <Drawer
          variant="permanent"
          sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
      )}
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {!user && <Toolbar />}
        {/* <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/incident-report" element={<ProtectedRoute><IncidentReport /></ProtectedRoute>} />
        </Routes> */}
        <Outlet/>
      </Box>
    </Box>
  );
};

export default Layout;