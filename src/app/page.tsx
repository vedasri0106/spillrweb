'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  isAnonymous: boolean;
  likes: number;
  createdAt: string;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentText, setCommentText] = useState('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:4000/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    await fetch(`http://localhost:4000/api/posts/${postId}/like`, { method: 'POST' });
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
  };

  const handleComment = async (postId: string) => {
    await fetch(`http://localhost:4000/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText }),
    });
    setCommentText('');
    fetchComments(postId);
  };

  const fetchComments = async (postId: string) => {
    const res = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data }));
  };

  const handleDelete = async (postId: string) => {
    await fetch(`http://localhost:4000/api/posts/${postId}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleEdit = async (postId: string) => {
    await fetch(`http://localhost:4000/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editedContent }),
    });
    setEditingPostId(null);
    setEditedContent('');
    fetchPosts();
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4 bg-white shadow">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">
              {post.isAnonymous ? 'Anonymous' : 'User'} · {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingPostId(post.id);
                  setEditedContent(post.content);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          {editingPostId === post.id ? (
            <>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingPostId(null);
                    setEditedContent('');
                  }}
                  className="bg-gray-300 text-black px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-medium my-2">{post.content}</p>
              {post.mediaUrl && (
                <img
                  src={`http://localhost:4000${post.mediaUrl}`}
                  alt="post"
                  className="w-full rounded mt-2"
                />
              )}
            </>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm">
            <button onClick={() => handleLike(post.id)} className="text-red-500">
              ❤️ {post.likes}
            </button>
            <button
              onClick={() => {
                fetchComments(post.id);
                setActivePostId(post.id);
              }}
              className="text-blue-600"
            >
              💬 Comments
            </button>
          </div>

          {activePostId === post.id && (
            <div className="mt-4 space-y-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => handleComment(post.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Post
              </button>
              <div className="mt-2 space-y-1">
                {(comments[post.id] || []).map((c) => (
                  <p
                    key={c.id}
                    className="text-sm bg-gray-100 rounded p-2 flex justify-between items-center"
                  >
                    <span>{c.text}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {formatDistanceToNow(new Date(c.createdAt))} ago
                    </span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}