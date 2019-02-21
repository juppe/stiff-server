import { getUser, getUserByUUID } from './users'
import { connectRedis } from './redis'

const redis = connectRedis()
const redisKeyPrefix = 'stiff:messages:'

// List all messages in room
export const listMessages = async msgRoom => {
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
export const writeMessage = async (msgRoom, msgUser, msgDate, msgMessage) => {
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
