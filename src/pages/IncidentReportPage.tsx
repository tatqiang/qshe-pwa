// src/pages/IncidentReportPage.tsx

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid // FIX: กลับมา import Grid ตัวดั้งเดิม
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
        {/* FIX: ใช้ Grid container เหมือนเดิม */}
        <Grid container spacing={3}>

          {/* FIX: กลับมาใช้ синтаксис ของ Grid v1 คือต้องมี 'item' prop */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              required
              fullWidth
              id="incident-type"
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

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="location"
              name="location"
              label="Location of Incident"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              id="description"
              name="description"
              label="Description of Incident"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="datetime-local"
              label="Date and Time of Incident"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
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