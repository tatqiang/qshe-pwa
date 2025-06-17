// src/pages/Register.tsx

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';

// Material-UI Components
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function RegisterPage() {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  // States for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // States for file handling
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  // States for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  // จัดการการเลือกรูปโปรไฟล์
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // จัดการการถ่ายรูปใบหน้า
  const captureFace = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFaceImage(imageSrc);
      setShowWebcam(false); // ปิดกล้องหลังถ่ายเสร็จ
    }
  }, [webcamRef]);

  // ฟังก์ชันแปลง Base64 (ที่ได้จาก webcam) เป็น File object
  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  // จัดการการ Submit ฟอร์ม
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!avatarFile || !faceImage) {
      setError("Please upload a profile picture and capture your face.");
      return;
    }
    
    setLoading(true);

    try {
      // 1. สมัครสมาชิกกับ Supabase Auth
      // เราส่ง first_name และ last_name ไปใน options.data เพื่อให้ trigger นำไปใช้
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Registration successful, but no user data returned.");

      const userId = authData.user.id;

      // 2. อัปโหลดรูปโปรไฟล์
      const avatarFileName = `${userId}/${uuidv4()}`;
      const { error: avatarUploadError } = await supabase.storage
        .from('avatars')
        .upload(avatarFileName, avatarFile);
      if (avatarUploadError) throw avatarUploadError;
      
      // 3. อัปโหลดรูปใบหน้า
      const faceImageFile = await dataUrlToFile(faceImage, 'face-verification.jpg');
      const faceFileName = `${userId}/${uuidv4()}`;
      // *** แก้ไขชื่อ Bucket ตรงนี้ ***
      const { error: faceUploadError } = await supabase.storage
        .from('face.verification') 
        .upload(faceFileName, faceImageFile);
      if (faceUploadError) throw faceUploadError;

      // 4. (ทางเลือก) อัปเดตตาราง profiles ด้วย URL ของรูปภาพ
      // หากต้องการเก็บ URL ไว้เพื่อใช้งานในอนาคต

      alert('Registration Successful! Please check your email to verify your account.');
      navigate('/login');

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Typography component="h1" variant="h4" align="center">
        Internal Staff Registration
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={4}>
          {/* ส่วนข้อมูล */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">1. Your Information</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>

          {/* ส่วนรูปภาพ */}
          <Grid item xs={12} md={6}>
            {/* รูปโปรไฟล์ */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">2. Profile Picture</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar src={avatarPreview || ''} sx={{ width: 100, height: 100, mr: 2 }} />
                  <Button variant="contained" component="label">
                    Upload Picture
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* รูปใบหน้า */}
            <Card>
              <CardContent>
                <Typography variant="h6">3. Face Verification</Typography>
                <Box sx={{ mt: 2, p: 1, border: '1px dashed grey', minHeight: 150, textAlign: 'center' }}>
                  {showWebcam && (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                    />
                  )}
                  {faceImage && !showWebcam && <img src={faceImage} alt="Face capture" width="100%" />}
                </Box>
              </CardContent>
              <CardActions>
                {!showWebcam ? (
                  <Button onClick={() => setShowWebcam(true)}>Open Camera</Button>
                ) : (
                  <Button onClick={captureFace} variant="contained">Take Photo</Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </Box>
    </Container>
  );
}

export default RegisterPage;