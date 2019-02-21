import { listMessages, writeMessage } from '../actions/messages'
import { connectRedis } from '../actions/redis'

const redis = connectRedis()

// GET messages
export const getMessages = async (req, res, next) => {
  const messages = await listMessages()
  res.send(messages)
}

// POST message
export const postMessage = async (req, res, next) => {
  const msgRoom = req.body.room
  const msgUser = req.session.passport.user
  const msgDate = req.body.date
  const msgMessage = req.body.message

  // Write message to database and publish
  const message = await writeMessage(msgRoom, msgUser, msgDate, msgMessage)
  await redis.publish('new_chat', JSON.stringify(message))
  res.send({ response: 'Message stored!' })
}
