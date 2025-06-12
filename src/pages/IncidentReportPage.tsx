// src/pages/IncidentReportPage.tsx

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid
} from '@mui/material';

const IncidentReportPage: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}> 
      <Typography variant="h4" gutterBottom>
        New Incident Report
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Please fill out the details of the incident below.
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
        {/* FIX 1: แก้ไข Grid container ไม่ต้องมี props พิเศษ */}
        <Grid container spacing={3}>

          {/* FIX 2: ลบ prop 'item' ออกจาก Grid และใช้ xs, sm โดยตรง */}
          <Grid xs={12} sm={6}>
            <TextField
              select
              required
              fullWidth
              id="incident-type" // FIX 3: เพิ่ม ID ที่นี่
              name="incidentType"
              label="Type of Incident"
              defaultValue=""
            >
              <MenuItem value="Injury">Injury</MenuItem>
              <MenuItem value="Near Miss">Near Miss</MenuItem>
              <MenuItem value="Property Damage">Property Damage</MenuItem>
              <MenuItem value="Hazardous Condition">Hazardous Condition</MenuItem>
            </TextField>
          </Grid>

          <Grid xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="location" // FIX 3: เพิ่ม ID ที่นี่
              name="location"
              label="Location of Incident"
            />
          </Grid>

          <Grid xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              id="description" // FIX 3: เพิ่ม ID ที่นี่
              name="description"
              label="Description of Incident"
            />
          </Grid>
          
          <Grid xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="datetime-local" // FIX 3: เพิ่ม ID ที่นี่
              label="Date and Time of Incident"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Grid ตัวนี้ไม่ต้องมีขนาด เพราะ Button จะจัดตัวเอง */}
          <Grid xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
            >
              Submit Report
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentReportPage;