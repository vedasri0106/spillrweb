'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(user => {
        setUsername(user.username || '');
        setBio(user.bio || '');
        if (user.profilePic) setPreview(`http://localhost:4000${user.profilePic}`);
      });
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (file) formData.append('profilePic', file);

    await fetch('http://localhost:4000/api/user/edit', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    router.push('/profile?updated=true');
  };

  return (
    <main className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">✏️ Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell something about you"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }
            }}
            className="w-full text-sm"
          />
        </div>
        {preview && (
          <div className="flex justify-center">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full border mt-4" />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}