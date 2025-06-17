// src/contexts/AuthContext.tsx

import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User, UserAttributes } from '@supabase/supabase-js';

// Define a more detailed Profile Type
export interface ProfileType {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

// Define the Project Type
export interface ProjectType {
  id: string;
  name: string;
  location?: string;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileType | null;
  project: ProjectType | null;
  setProject: (project: ProjectType | null) => void;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updatedInfo: Partial<ProfileType>) => Promise<void>;
  updateAuthUser: (attributes: UserAttributes) => Promise<any>; // <-- ADD THIS for email/password
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... useEffect logic to fetch session and profile remains the same ...
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
        setProfile(profileData as ProfileType | null);
      }
      setLoading(false);
    };
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (event === "SIGNED_IN" && session?.user) {
           const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
           setProfile(profileData as ProfileType | null);
        }
        if (event === "SIGNED_OUT") {
          setProject(null);
          setProfile(null);
        }
        // Also listen for password recovery to refetch user
        if (event === "PASSWORD_RECOVERY") {
          const { data: { session: newSession } } = await supabase.auth.getSession();
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
        setLoading(false);
      }
    );
    return () => { authListener.subscription.unsubscribe(); };
  }, []);
  
  const updateProfile = async (updatedInfo: Partial<ProfileType>) => {
    if (!profile) throw new Error("No profile to update");
    const { data, error } = await supabase.from('profiles').update(updatedInfo).eq('id', profile.id).select().single();
    if (error) throw error;
    setProfile(data as ProfileType);
  };

  // --- ADD THIS FUNCTION for email/password updates ---
  const updateAuthUser = async (attributes: UserAttributes) => {
    const { data, error } = await supabase.auth.updateUser(attributes);
    if (error) throw error;
    // The onAuthStateChange listener will handle updating the user state
    return data;
  };

  const signUp = (email: string, password: string, firstName: string, lastName: string) => {
    return supabase.auth.signUp({ email, password, options: { data: { first_name: firstName, last_name: lastName } } });
  };

  const signInWithPassword = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    project,
    setProject,
    signUp,
    signInWithPassword,
    signOut,
    updateProfile,
    updateAuthUser, // <-- ADD THIS
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}