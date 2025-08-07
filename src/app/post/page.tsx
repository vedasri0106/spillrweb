'use client';
import { useState } from 'react';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const token = localStorage.getItem('token'); // ✅ get token

  const formData = new FormData();
  formData.append('content', content);
  formData.append('isAnonymous', JSON.stringify(isAnonymous));
  if (media) formData.append('media', media);

  try {
    const res = await fetch('http://localhost:4000/api/posts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // ✅ add auth token here
      },
      body: formData,
    });

    if (res.ok) {
      setContent('');
      setMedia(null);
      alert('Posted successfully!');
    } else {
      const errorText = await res.text();
      console.error('❌ Failed to post:', errorText);
      alert('Failed to post.');
    }
  } catch (err) {
    console.error('❌ Network error:', err);
    alert('Network error. Try again.');
  }

  setLoading(false);
};


  return (
    <main className="max-w-md mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Create a Spill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border p-3 rounded-lg"
          placeholder="What's on your mind?"
          required
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files?.[0] || null)}
          className="w-full"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={() => setIsAnonymous(!isAnonymous)}
          />
          <span>Post anonymously</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </main>
  );
}