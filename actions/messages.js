import moment from 'moment'
import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const listMessages = async () => {
  try {
    const data = await redis.zrange('messages', 0, 2549099538343)
    const messages = data.map(m => JSON.parse(m))
    return messages
  } catch (error) {
    console.log('Error fetching messages:', JSON.stringify(error, null, 2))
  }
}

const writeMessage = async message => {
  const date = moment.now()
  const data = JSON.stringify({
    date: date,
    message: message
  })
  console.log('write_message')
  try {
    await redis.zadd('messages', date, data)
  } catch (error) {
    console.log('Error writing message:', JSON.stringify(error, null, 2))
  }
}

export const messages = {
  listMessages,
  writeMessage
}
