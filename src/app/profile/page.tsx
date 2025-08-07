'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  email?: string;
  username?: string;
  isAnonymous: boolean;
  createdAt: string;
  bio?: string;
  profilePic?: string;
}

interface Post {
  id: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  isAnonymous: boolean;
  likes?: number;
  comments?: { id: string }[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const searchParams = useSearchParams();
  const updated = searchParams.get('updated');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:4000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });

    fetch('http://localhost:4000/api/posts/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPosts);
  }, [updated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleDeletePost = async (postId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPosts(posts.filter(p => p.id !== postId));
    } else {
      alert('Failed to delete post.');
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/edit-post?id=${postId}`);
  };

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <main className="max-w-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👤 Profile</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded shadow mb-6">
        <img
          src={user.profilePic ? `http://localhost:4000${user.profilePic}` : '/default-avatar.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <p className="text-xl font-bold">{user.username || 'Anonymous'}</p>
          <p className="text-gray-500">{user.email || 'No email'}</p>
          <p className="italic text-gray-600">{user.bio || 'No bio yet.'}</p>
          <p className="text-xs text-gray-400 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400">Anonymous: {user.isAnonymous ? 'Yes' : 'No'}</p>
          <button
            onClick={() => router.push('/edit-profile')}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <hr className="my-4" />
      <h2 className="text-xl font-semibold mb-2">📝 Your Spills</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="border p-3 mb-3 rounded shadow-sm bg-white">
            <p className="text-sm text-gray-500">
              {post.isAnonymous ? 'Anonymous' : user.username}
            </p>
            <p className="text-md">{post.content}</p>

            {post.mediaUrl && (
              <img
                src={`http://localhost:4000${post.mediaUrl}`}
                className="rounded mt-2 max-h-64 object-cover"
                alt="post media"
              />
            )}
<p className="text-xs text-gray-400 mt-1">
  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
</p>

<div className="flex space-x-3 mt-2">
  <button
    onClick={async () => {
      const confirmed = confirm('Are you sure you want to delete this post?');
      if (!confirmed) return;

      const res = await fetch(`http://localhost:4000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts(posts.filter(p => p.id !== post.id));
      } else {
        alert('Failed to delete post');
      }
    }}
    className="text-red-500 text-sm"
  >
    Delete
  </button>

  <button
    onClick={() => {
      const newContent = prompt('Edit your post:', post.content || '');
      if (!newContent) return;

      fetch(`http://localhost:4000/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      }).then(res => {
        if (res.ok) {
          setPosts(posts.map(p => p.id === post.id ? { ...p, content: newContent } : p));
        } else {
          alert('Update failed');
        }
      });
    }}
    className="text-blue-500 text-sm"
  >
    Edit
  </button>
</div>

            </div>
            ))
        )}
    </main>
  );
}