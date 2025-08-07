// src/routes/dmRoutes.ts

import express from 'express'
import { prisma } from '../lib/prisma'
import authenticate from '../middleware/auth'

const router = express.Router()

// ✅ GET /api/dm/:userId - Get all messages between current user and :userId
router.get('/:userId', authenticate, async (req, res) => {
  const currentUserId = (req as any).user.id
  const otherUserId = req.params.userId

  try {
    const messages = await prisma.dM.findMany({
      where: {
        OR: [
          { fromId: currentUserId, toId: otherUserId },
          { fromId: otherUserId, toId: currentUserId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json(messages)
  } catch (err) {
    console.error('❌ Error fetching messages:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ✅ POST /api/dm/send - Send message from current user
router.post('/send', authenticate, async (req, res) => {
  const fromId = (req as any).user.id
  const { toId, text } = req.body

  if (!fromId || !toId || !text) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    const newMessage = await prisma.dM.create({
      data: { fromId, toId, text },
    })

    res.status(201).json(newMessage)
  } catch (err) {
    console.error('❌ Error sending message:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router