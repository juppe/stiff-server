import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const redisKeyPrefix = 'stiff:messages:'

const listMessages = async msgRoom => {
  const redisKey = redisKeyPrefix + msgRoom

  try {
    const data = await redis.lrange(redisKey, 0, -1)
    const messages = data.map(m => JSON.parse(m))

    console.log(messages)
    return messages
  } catch (error) {
    console.log('Error fetching messages:', JSON.stringify(error, null, 2))
  }
}

const writeMessage = async (msgRoom, msgUser, msgDate, msgMessage) => {
  const redisKey = redisKeyPrefix + msgRoom

  const data = JSON.stringify({
    date: msgDate,
    user: msgUser,
    message: msgMessage
  })
  console.log('write_message')
  try {
    await redis.rpush(redisKey, data)
  } catch (error) {
    console.log('Error writing message:', JSON.stringify(error, null, 2))
  }
}

export const messages = {
  listMessages,
  writeMessage
}
