'use client'

import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Sidebar from './sidebar/page'

const socket = io('http://localhost:4000')

interface ChatMessage {
  userId: string
  text: string
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
  // Get or set user ID
  let uid = localStorage.getItem('userId');
  if (!uid) {
    uid = 'anon_' + Math.floor(Math.random() * 10000);
    localStorage.setItem('userId', uid);
  }
  setUserId(uid);

  // ✅ Load old messages from DB
  fetch('http://localhost:4000/api/live')
    .then(res => res.json())
    .then(data => setMessages(data));

  // ✅ Listen to live incoming messages
  socket.on('receive_message', (data: ChatMessage) => {
    setMessages(prev => [...prev, data]);
  });

  return () => {
    socket.off('receive_message');
  };
}, []);


  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('send_message', { userId, text: input })
      setInput('')
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col p-4 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">🌐 Live Chat</h2>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-white shadow-inner">
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages yet.</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 max-w-sm px-4 py-2 rounded-lg shadow ${
                  msg.userId === userId
                    ? 'bg-blue-500 text-white self-end ml-auto'
                    : 'bg-gray-200 text-black self-start'
                }`}
              >
                <span className="block text-xs font-bold mb-1">
                  {msg.userId}
                </span>
                <span>{msg.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Input Field */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded shadow"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}