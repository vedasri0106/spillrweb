'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

interface DM {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: string;
}

export default function DMPage() {
  const { id: receiverId } = useParams()
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  const [messages, setMessages] = useState<DM[]>([])
  const [text, setText] = useState('')
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('❌ No token found in localStorage')
        return
      }

      const res = await fetch(`http://localhost:4000/api/dm/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      if (Array.isArray(data)) {
        setMessages(data)
        scrollToBottom()
      } else {
        console.error('❌ Messages response is not an array:', data)
        setMessages([])
      }
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err)
    }
  }

  useEffect(() => {
    if (receiverId && currentUserId) {
      fetchMessages()
    }
  }, [receiverId, currentUserId])

  const sendMessage = async () => {
    if (!text.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      console.error('❌ No token found in localStorage')
      return
    }

    await fetch('http://localhost:4000/api/dm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        toId: receiverId,
        text,
      }),
    })

    setText('')
    fetchMessages()
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat with <span className="text-blue-500">{receiverId}</span></h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
              msg.fromId === currentUserId
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 text-gray-800'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2 bg-white">
        <input
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  )
}