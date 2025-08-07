'use client';
import { useState } from 'react';
import API from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateSpill() {
  const [text, setText] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const router = useRouter();

  const post = async () => {
    const token = localStorage.getItem('token');
    await API.post('/api/posts', { content: text, isAnonymous: isAnon }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    router.push('/');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Create Spill</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} className="border p-2 w-full mb-4" placeholder="What's your secret?..." />
      <label className="block mb-2">
        <input type="checkbox" checked={isAnon} onChange={() => setIsAnon(!isAnon)} />
        &nbsp; Post as Anonymous
      </label>
      <button onClick={post} className="bg-purple-600 text-white px-4 py-2">Spill It</button>
    </div>
  );
}