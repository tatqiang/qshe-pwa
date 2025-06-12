// src/pages/IncidentReportPage.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid // Using the stable Grid import
} from '@mui/material';

interface IFormData {
  incidentType: string;
  location: string;
  description: string;
  incidentDateTime: string;
}

const IncidentReportPage: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    incidentType: '',
    location: '',
    description: '',
    incidentDateTime: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    console.log("Form Submitted Data:", formData);
    alert('Report Submitted! Check the console for the data.');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        New Incident Report
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Please fill out the details of the incident below.
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }} onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* This Grid item now takes up the full width on all screen sizes */}
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              id="incident-type"
              name="incidentType"
              label="Type of Incident"
              value={formData.incidentType}
              onChange={handleChange}
            >
              <MenuItem value="Injury">Injury</MenuItem>
              <MenuItem value="Near Miss">Near Miss</MenuItem>
              <MenuItem value="Property Damage">Property Damage</MenuItem>
              <MenuItem value="Hazardous Condition">Hazardous Condition</MenuItem>
            </TextField>
          </Grid>

          {/* This Grid item also takes the full width */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="location"
              name="location"
              label="Location of Incident"
              value={formData.location}
              onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="datetime-local"
              name="incidentDateTime"
              label="Date and Time of Incident"
              type="datetime-local"
              value={formData.incidentDateTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
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