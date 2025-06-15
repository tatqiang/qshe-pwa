// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // <-- import useNavigate

export default function Login() {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate(); // <-- hook สำหรับเปลี่ยนหน้า
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { data, error } = await signInWithPassword(email, password);
      if (error) throw error;
      // ถ้า Login สำเร็จ ให้เด้งไปหน้า Dashboard
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Log In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
        <button disabled={loading} type="submit">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}