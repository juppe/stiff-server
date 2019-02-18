import Redis from 'ioredis'
import { users as users_action } from '../actions'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const { getUser, getUserByUUID } = users_action
const redisKeyPrefix = 'stiff:messages:'

// List all messages in room
const listMessages = async msgRoom => {
  const redisKey = redisKeyPrefix + msgRoom

  try {
    const data = await redis.lrange(redisKey, 0, -1)

    const messages = data.map(async m => {
      const mess = JSON.parse(m)
      const user = await getUserByUUID(mess.uuid)

      return {
        date: mess.date,
        username: user.username,
        nickname: user.nickname,
        message: mess.message,
        room: msgRoom
      }
    })
    return Promise.all(messages)
  } catch (error) {
    console.log('Error fetching messages:', JSON.stringify(error, null, 2))
  }
}

// Add new message in room
const writeMessage = async (msgRoom, msgUser, msgDate, msgMessage) => {
  const redisKey = redisKeyPrefix + msgRoom
  const user = await getUser(msgUser)

  const data = JSON.stringify({
    date: msgDate,
    uuid: user.uuid,
    message: msgMessage
  })
  try {
    await redis.rpush(redisKey, data)
    return {
      date: msgDate,
      username: user.username,
      nickname: user.nickname,
      message: msgMessage,
      room: msgRoom
    }
  } catch (error) {
    console.log('Error writing message:', JSON.stringify(error, null, 2))
  }
}

export const messages = {
  listMessages,
  writeMessage
}
