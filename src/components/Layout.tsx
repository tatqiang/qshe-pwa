// src/components/Layout.tsx

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useAuth } from '../contexts/AuthContext'; // 2. Import useAuth

// Material-UI Components
import {
  AppBar, Toolbar, IconButton, Typography, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, CssBaseline, Divider
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout'; // 3. Import ไอคอน Logout

const drawerWidth = 240;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth(); // 4. ดึงฟังก์ชัน signOut มาจาก Context
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 5. สร้างฟังก์ชันสำหรับจัดการการ Logout
  const handleLogout = async () => {
    await signOut();
    // หลังจาก signOut, AuthGuard ของเราจะทำงานและพาไปหน้า Login อัตโนมัติ
    // แต่เราสามารถใช้ navigate เพื่อความแน่นอนก็ได้
    navigate('/login'); 
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/incident-report')}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Incident Report" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider /> {/* เพิ่มเส้นคั่นเมนู */}
      <List>
        {/* 6. เพิ่มปุ่ม Logout เข้าไปในเมนู */}
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
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            QSHE Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
