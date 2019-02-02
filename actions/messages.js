import moment from 'moment'
import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const getMessages = async () => {
  try {
    const data = await redis.zrange('Messages', 0, 2549099538343)
    const messages = data.map(m => JSON.parse(m))
    console.log('MESSAGES: ' + messages)
    return messages
  } catch (error) {
    console.log('Error fetching messages:', JSON.stringify(error, null, 2))
  }
}

const writeMessage = async data => {
  const date = moment.now()
  const message = JSON.stringify({
    date: date,
    username: data.username,
    message: data.message
  })

  try {
    const add = redis.zadd('Messages', date, message)
    const publish = redis.publish('Messages', message)
    await Promise.all([add, publish])
  } catch (error) {
    console.log('Error writing message:', JSON.stringify(error, null, 2))
  }
}

export const messages = {
  getMessages,
  writeMessage
}
