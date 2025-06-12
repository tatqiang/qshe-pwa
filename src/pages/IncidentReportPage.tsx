// src/pages/IncidentReportPage.tsx

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, MenuItem, Grid } from '@mui/material';
import { supabase } from '../supabaseClient'; // 1. นำเข้า supabase client

// ... interface IFormData (เหมือนเดิม) ...
interface IFormData {
  incidentType: string;
  location: string;
  description: string;
  incidentDateTime: string;
}

const IncidentReportPage: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({ /* ... */ });
  const [isSubmitting, setIsSubmitting] = useState(false); // State สำหรับควบคุมปุ่มตอนกำลังส่งข้อมูล

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { /* ...เหมือนเดิม... */ };

  // 2. ปรับ handleSubmit ให้เป็น async และเพิ่มการเชื่อมต่อ Supabase
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); // เริ่มกระบวนการส่งข้อมูล

    // เตรียมข้อมูลที่จะส่ง ให้ชื่อ key ตรงกับชื่อ column ในตาราง
    const submissionData = {
      incident_type: formData.incidentType,
      location: formData.location,
      description: formData.description,
      incident_date_time: formData.incidentDateTime,
    };

    try {
      const { error } = await supabase
        .from('incidents') // เลือกตาราง 'incidents'
        .insert([submissionData]); // เพิ่มข้อมูลใหม่

      if (error) {
        throw error;
      }

      alert('Incident report submitted successfully!');
      // อาจจะเคลียร์ฟอร์มหรือเปลี่ยนหน้าไปที่อื่นหลังจากส่งสำเร็จ
    } catch (error: any) {
      alert(`Error submitting report: ${error.message}`);
    } finally {
      setIsSubmitting(false); // สิ้นสุดกระบวนการส่งข้อมูล
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      {/* ...ส่วน UI เหมือนเดิมทั้งหมด... */}
      {/* แค่เพิ่ม disabled ให้ปุ่มตอนกำลังส่งข้อมูล */}
      <Box component="form" /* ... */ onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* ...TextFields ทั้งหมดเหมือนเดิม... */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              disabled={isSubmitting} // 3. ทำให้ปุ่มกดไม่ได้ตอนกำลังส่งข้อมูล
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentReportPage;