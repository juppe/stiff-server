import { Router } from 'express'
import Redis from 'ioredis'
import { requireAuth } from '../auth'
import { messages as messages_action } from '../actions'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const { listMessages, writeMessage } = messages_action

const router = Router()
const pub = new Redis(redis_address)

// GET messages
router.get('/', requireAuth(), async (req, res) => {
  const messages = await listMessages()
  res.send(messages)
})

// POST message
router.post('/', requireAuth(), async (req, res) => {
  const msgRoom = req.body.room
  const msgUser = req.session.passport.user
  const msgDate = req.body.date
  const msgMessage = req.body.message

  // Write message to database and publish
  const message = await writeMessage(msgRoom, msgUser, msgDate, msgMessage)
  await pub.publish('new_chat', JSON.stringify(message))
  res.send({ response: 'Message stored!' })
})

export const messages = router
