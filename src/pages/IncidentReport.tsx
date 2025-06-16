// src/pages/IncidentReportPage.tsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
} from '@mui/material';
// 1. Import the new DateTimePicker component
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// Import Dayjs for type definition
import { Dayjs } from 'dayjs';
import { supabase } from '../lib/supabaseClient';

// 2. Update the interface to use Dayjs
interface IFormData {
  incidentType: string;
  location: string;
  description: string;
  incidentDateTime: Dayjs | null;
}

const IncidentReportPage: React.FC = () => {
  // 3. Update the initial state for incidentDateTime to null
  const [formData, setFormData] = useState<IFormData>({
    incidentType: '',
    location: '',
    description: '',
    incidentDateTime: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This function handles the standard text fields
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // 4. This new function specifically handles the DateTimePicker's value
  const handleDateTimeChange = (newValue: Dayjs | null) => {
    setFormData(prevState => ({
      ...prevState,
      incidentDateTime: newValue
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // 5. Convert Dayjs object to a string format for Supabase
    const submissionData = {
      incident_type: formData.incidentType,
      location: formData.location,
      description: formData.description,
      incident_date_time: formData.incidentDateTime ? formData.incidentDateTime.toISOString() : null,
    };

    try {
      const { error } = await supabase
        .from('incidents')
        .insert([submissionData]);

      if (error) { throw error; }

      alert('Incident report submitted successfully!');
      setFormData({
        incidentType: '',
        location: '',
        description: '',
        incidentDateTime: null
      });

    } catch (error: any) {
      alert(`Error submitting report: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        New Incident Report
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Please fill out the details of the incident below.
      </Typography>

      <Box 
        component="form" 
        noValidate 
        autoComplete="off" 
        sx={{ 
          mt: 3,
          // This styles all TextFields AND the new DateTimePicker
          '& > .MuiFormControl-root': { mb: 3 },
        }} 
        onSubmit={handleSubmit}
      >
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

        <TextField
          required
          fullWidth
          id="location"
          name="location"
          label="Location of Incident"
          value={formData.location}
          onChange={handleChange}
        />

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
        
        {/* 6. Replace the old TextField with the new DateTimePicker component */}
        <DateTimePicker
          label="Date and Time of Incident *"
          value={formData.incidentDateTime}
          onChange={handleDateTimeChange}
          sx={{ width: '100%' }}
        />

        <Box sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default IncidentReportPage;