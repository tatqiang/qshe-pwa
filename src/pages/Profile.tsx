// src/pages/Profile.tsx

import React, { useState } from 'react';
import {
  Container, Typography, Card, CardContent, Button, Box,
  CircularProgress, Alert, Grid, Avatar, Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { UserAttributes } from '@supabase/supabase-js';
import { ProfileForm } from '../components/ProfileForm'; // Import our new component

function ProfilePage() {
    const { user, profile, updateProfile, updateAuthUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: 'image/jpeg' });
    }

    const handleUpdate = async (formData: any) => {
        if (!profile || !user) return;
        if (formData.error) {
            setError(formData.error);
            return;
        }

        const { firstName, lastName, email, password, faceImage } = formData;
        
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const authUpdates: UserAttributes = {};
            if (email !== user.email) authUpdates.email = email;
            if (password) authUpdates.password = password;
            if (Object.keys(authUpdates).length > 0) {
                await updateAuthUser(authUpdates);
                setSuccess("Auth details updated.");
            }

            let newAvatarUrl = profile.avatar_url;
            // Only upload a new photo if one was taken
            if (faceImage && !faceImage.startsWith('http')) {
                const faceImageFile = await dataUrlToFile(faceImage, 'profile-and-verification.jpg');
                const filePath = `${profile.user_id}/${uuidv4()}`;
                await supabase.storage.from('avatars').upload(filePath, faceImageFile, { upsert: true });
                await supabase.storage.from('face.verification').upload(filePath, faceImageFile, { upsert: true });
                newAvatarUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl;
            }

            const profileUpdates = { first_name: firstName, last_name: lastName, avatar_url: newAvatarUrl };
            await updateProfile(profileUpdates);
            
            setSuccess(prev => (prev ? prev + " | Profile info updated." : "Profile info updated."));
            setIsEditing(false);

        } catch (err: any) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <Container><CircularProgress /></Container>;

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
                <Typography variant="h4">My Profile</Typography>
                {!isEditing && <Button variant="contained" onClick={() => setIsEditing(true)}>Edit Profile</Button>}
            </Box>

            {isEditing ? (
                <ProfileForm
                    mode="edit"
                    initialProfile={profile}
                    initialEmail={user?.email}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                    loading={loading}
                    error={error}
                    success={success}
                />
            ) : (
                // View Mode
                <Card>
                    <CardContent>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                                <Avatar src={profile.avatar_url || ''} sx={{ width: 150, height: 150, margin: 'auto' }} />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h5" gutterBottom>{profile.first_name} {profile.last_name}</Typography>
                                <Typography color="text.secondary">Email: {user?.email}</Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography color="text.secondary">Profile ID: {profile.id}</Typography>
                                <Typography color="text.secondary">Auth ID: {profile.user_id}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
            
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        </Container>
    );
}

export default ProfilePage;