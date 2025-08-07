// app/chat/sidebar/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  username: string
  profilePic: string | null
}

export default function Sidebar() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/auth/users')
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '18px' }}>Chats</h2>
      <div style={{ marginTop: 16 }}>
        {users.map(user => (
          <Link href={`/dm/${user.id}`} key={user.id}>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
              <img
                src={user.profilePic || '/default-avatar.png'}
                alt="pfp"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.username || 'Anonymous'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}