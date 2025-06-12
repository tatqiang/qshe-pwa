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
import { supabase } from '../supabaseClient';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      incident_type: formData.incidentType,
      location: formData.location,
      description: formData.description,
      incident_date_time: formData.incidentDateTime,
    };

    try {
      const { error } = await supabase
        .from('incidents')
        .insert([submissionData]);

      if (error) {
        throw error;
      }

      alert('Incident report submitted successfully!');
      // เคลียร์ฟอร์มหลังจากส่งข้อมูลสำเร็จ
      setFormData({
        incidentType: '',
        location: '',
        description: '',
        incidentDateTime: ''
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
          '& .MuiTextField-root': { mb: 3 },
        }} 
        onSubmit={handleSubmit}
      >
        {/* ======================================= */}
        {/* โค้ดส่วนของฟอร์มที่หายไป อยู่ตรงนี้ครับ */}
        {/* ======================================= */}
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
    </Paper>
  );
};

export default IncidentReportPage;