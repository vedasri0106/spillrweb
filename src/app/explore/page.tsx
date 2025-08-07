'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Explore Spills</h1>

      {posts.map((post: any) => (
        <div key={post.id} className="bg-white rounded-lg border shadow-md">
          {/* User Header */}
          <div className="flex items-center p-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
              {post.isAnonymous ? "A" : post.user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-sm">
                {post.isAnonymous ? "Anonymous" : post.user?.username}
              </p>
              <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Media */}
          {post.mediaUrl && (
            <div className="relative w-full h-64">
              <Image
                src={post.mediaUrl}
                alt="Post media"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content + Actions */}
          <div className="p-4">
            <p className="mb-2 text-sm">{post.content}</p>
            <div className="flex space-x-6 text-gray-600 text-sm">
              <button className="hover:text-red-500">❤️ Like</button>
              <button className="hover:text-blue-500">💬 Comment</button>
              <button className="hover:text-green-600">🔗 Share</button>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}