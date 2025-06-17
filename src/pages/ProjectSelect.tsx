import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // ตรวจสอบ path
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // <-- Import useAuth ของเรา
import type { ProjectType } from '../contexts/AuthContext'; // <-- Import Type มาใช้ด้วย

// --- Material-UI Components ---
import {
  Container,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Box,
  Divider,
  ListItemIcon
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

function ProjectSelect() {
  // --- เรียกใช้ Context ของเรา ---
  const { user, setProject } = useAuth(); 

  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ถ้าไม่มี user ให้กลับไปหน้า login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    console.log('CURRENT LOGGED-IN USER ID:', user.id); 

    const fetchProjects = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('id, name, location');

      if (fetchError) {
        console.error('Error fetching projects:', fetchError);
        setError(fetchError);
      } else if (data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [user, navigate]);

  const handleProjectSelect = (selectedProject: ProjectType) => {
    console.log('Selected Project:', selectedProject);
    
    // 1. เก็บโปรเจกต์ที่เลือกลงใน Context
    setProject(selectedProject);
    
    // 2. พาไปหน้า Dashboard
    navigate("/dashboard", { replace: true });
  };
  
  // --- Render UI ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardHeader title="Select Project" />
        <Divider />
        <CardContent>
          {error && <Alert severity="error">Error: {error.message}</Alert>}
          {!error && projects.length > 0 ? (
            <List>
              {projects.map((p) => (
                <ListItemButton key={p.id} onClick={() => handleProjectSelect(p)}>
                  <ListItemIcon><FolderIcon /></ListItemIcon>
                  <ListItemText primary={p.name} secondary={p.location} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            !error && <Alert severity="info">You are not assigned to any projects.</Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProjectSelect;
