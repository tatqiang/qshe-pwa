// src/components/Layout.tsx

import React from 'react'; // 1. นำเข้า useState จาก React
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

// --- ส่วนที่เพิ่มเข้ามาสำหรับ Drawer ---
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SummarizeIcon from '@mui/icons-material/Summarize'; // เปลี่ยนไอคอนให้สื่อถึง Report
// --- จบส่วนที่เพิ่มเข้ามา ---

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // 2. เพิ่ม state เพื่อจัดการสถานะการเปิด/ปิดของ Drawer
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // 3. สร้างฟังก์ชันสำหรับเปิด/ปิด Drawer
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const drawerWidth = 240; // กำหนดความกว้างของ Drawer

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* 4. ผูกฟังก์ชัน handleDrawerToggle เข้ากับ onClick ของปุ่มเมนู */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            QSHE Management
          </Typography>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 5. เพิ่มโค้ดของ Drawer Component */}
      <Drawer
        variant="temporary" // temporary คือจะแสดงเมื่อถูกเรียก และซ่อนเมื่อไม่ได้ใช้งาน
        open={isDrawerOpen}
        onClose={handleDrawerToggle} // ทำให้สามารถปิด Drawer ได้โดยการคลิกที่พื้นที่ด้านนอก
        ModalProps={{
          keepMounted: true, // เพื่อประสิทธิภาพที่ดีขึ้นบนมือถือ
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar /> {/* เพิ่ม Toolbar ว่างๆ เพื่อให้เนื้อหาใน Drawer ไม่ถูก AppBar บัง */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SummarizeIcon />
                </ListItemIcon>
                <ListItemText primary="Incident Report" />
              </ListItemButton>
            </ListItem>
            {/* ในอนาคตเราจะเพิ่มเมนูอื่นๆ ที่นี่ เช่น Inspections, PTW */}
          </List>
        </Box>
      </Drawer>
      
      {/* ส่วนของเนื้อหาหลัก (เหมือนเดิม) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
};

export default Layout;