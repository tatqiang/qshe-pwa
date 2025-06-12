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
    // Paper provides a nice, clean container with a shadow
    <Paper elevation={3} sx={{ p: 4 }}> 
      <Typography variant="h4" gutterBottom>
        New Incident Report
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Please fill out the details of the incident below.
      </Typography>

      {/* Box is used as a form container */}
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
        <Grid container spacing={3}>

          {/* Type of Incident (Dropdown) */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              required
              fullWidth
              id="incident-type"
              name="incidentType"
              label="Type of Incident"
              defaultValue="" // Default empty value
            >
              <MenuItem value="Injury">Injury</MenuItem>
              <MenuItem value="Near Miss">Near Miss</MenuItem>
              <MenuItem value="Property Damage">Property Damage</MenuItem>
              <MenuItem value="Hazardous Condition">Hazardous Condition</MenuItem>
            </TextField>
          </Grid>

          {/* Location of Incident (Text Field) */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="location"
              name="location"
              label="Location of Incident"
            />
          </Grid>

          {/* Description (Multiline Text Field) */}
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
          
          {/* Date and Time (Date-Time Picker) */}
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

          {/* Submit Button */}
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