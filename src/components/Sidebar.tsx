'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  username: string
  profilePic?: string | null
}

export default function Sidebar() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:4000/api/user/all', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('❌ Failed to fetch users:', err)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg">Chats</h2>
      <div className="mt-4 space-y-2">
        {users.map(user => (
          <Link href={`/dm/${user.id}`} key={user.id}>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
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