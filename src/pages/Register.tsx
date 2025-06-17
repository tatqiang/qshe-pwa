// src/pages/Register.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Container, Typography, Alert, Box, CircularProgress } from '@mui/material';
import { ProfileForm } from '../components/ProfileForm'; // Import our new component

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], filename, { type: 'image/jpeg' });
  }

  const handleRegister = async (formData: any) => {
    // Check for validation errors passed from the child
    if (formData.error) {
        setError(formData.error);
        return;
    }
    
    const { firstName, lastName, email, password, faceImage } = formData;

    if (!faceImage) {
      setError("Please capture a profile and verification photo.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Registration failed.");

      const userId = authData.user.id;
      
      const faceImageFile = await dataUrlToFile(faceImage, 'profile-and-verification.jpg');
      const faceFileName = `${userId}/${uuidv4()}`;

      // Upload the single image to both buckets
      await supabase.storage.from('avatars').upload(faceFileName, faceImageFile, { upsert: true });
      await supabase.storage.from('face.verification').upload(faceFileName, faceImageFile, { upsert: true });

      setSuccess('Registration Successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 3000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Internal Staff Registration
      </Typography>
      
      <ProfileForm
        mode="register"
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        success={success}
      />
      
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
    </Container>
  );
}

export default RegisterPage;