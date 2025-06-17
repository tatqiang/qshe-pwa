// src/components/ProfileForm.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Grid, TextField, Button, Avatar, Card, CardContent, 
  CardActions, Typography, IconButton, Divider, Switch, FormControlLabel
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';
import Webcam from 'react-webcam';
import { ProfileType } from '../contexts/AuthContext'; // Import types

// Define the props this component will accept
interface ProfileFormProps {
  mode: 'register' | 'edit';
  initialProfile?: ProfileType | null;
  initialEmail?: string;
  onSubmit: (formData: any) => Promise<void>;
  onCancel?: () => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export function ProfileForm({ 
  mode, initialProfile, initialEmail, onSubmit, onCancel, loading, error 
}: ProfileFormProps) {
  
  const webcamRef = useRef<Webcam>(null);

  // Form data state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Image and Camera State
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); // For camera switch

  // Sync state with initial data on load
  useEffect(() => {
    setFirstName(initialProfile?.first_name || '');
    setLastName(initialProfile?.last_name || '');
    setFaceImage(initialProfile?.avatar_url || null);
    setEmail(initialEmail || '');
  }, [initialProfile, initialEmail]);

  const captureFace = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFaceImage(imageSrc);
      setShowWebcam(false);
    }
  }, [webcamRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      onSubmit({ error: "Passwords do not match." });
      return;
    }
    onSubmit({
      firstName, lastName, email, password, faceImage
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* --- FIX STARTS HERE: Removed the "item" prop from Grid children --- */}
      <Grid container spacing={4}>
        {/* Left Column: Image Capture */}
        <Grid xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', maxWidth: '350px' }}>
              <Card sx={{ width: '100%', p: 1 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      {mode === 'register' ? 'Profile & Verification Photo' : 'Update Photo'}
                    </Typography>
                    <Avatar src={faceImage || ''} sx={{ width: 150, height: 150, margin: 'auto', mb: 2 }} />
                     <Box sx={{ mt: 1, p: 1, border: '1px dashed grey', minHeight: 150, textAlign: 'center' }}>
                      {showWebcam && (
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width="100%"
                          videoConstraints={{ facingMode }}
                        />
                      )}
                      {!faceImage && !showWebcam && <Typography sx={{p: 5}}>Camera Preview</Typography>}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', flexDirection: 'column' }}>
                    {showWebcam && (
                      <FormControlLabel
                          control={<Switch checked={facingMode === 'environment'} onChange={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))} />}
                          label="Switch to Rear Camera"
                          sx={{mb: 1}}
                        />
                    )}
                    {!showWebcam ? (
                      <Button onClick={() => setShowWebcam(true)} startIcon={<PhotoCamera />}>Open Camera</Button>
                    ) : (
                      <Button onClick={captureFace} variant="contained">Take Photo</Button>
                    )}
                  </CardActions>
                </Card>
            </Box>
        </Grid>

        {/* Right Column: User Details */}
        <Grid xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Details</Typography>
              <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth required margin="normal" />
              <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth required margin="normal" />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Account Security</Typography>
              <TextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required margin="normal" helperText={mode === 'edit' ? "Changing email may require re-verification." : ""} />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required={mode === 'register'} margin="normal" helperText={mode === 'edit' ? "Leave blank to keep current password." : ""} />
              <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required={mode === 'register' || !!password} margin="normal" />
            </CardContent>
            {mode === 'edit' && onCancel && (
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  Save Changes
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      </Grid>
      {/* --- FIX ENDS HERE --- */}
      
      {mode === 'register' && (
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          Register
        </Button>
      )}
    </Box>
  );
}
