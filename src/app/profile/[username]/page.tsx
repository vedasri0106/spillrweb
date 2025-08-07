// 📄 src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api'; // ✅ make sure this path is correct

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post('/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2 block w-full"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="border p-2 mb-4 block w-full"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 w-full">
        Login
      </button>
    </div>
  );
}
