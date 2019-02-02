import moment from 'moment'
import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const getUsers = async () => {
  try {
    const data = await redis.hgetall('Users')
    const users = Object.keys(data).map(key => JSON.parse(data[key]))
    return users
  } catch (error) {
    console.log('Error fetching Users:', JSON.stringify(error, null, 2))
  }
}

const createUser = async (username, fullname) => {
  const member = {
    username: username,
    fullname: fullname
  }

  try {
    const data = await redis.hset('Users', username, JSON.stringify(member))
    return data
  } catch (error) {
    console.error('Unable to add user:', JSON.stringify(error, null, 2))
  }
}

export const users = {
  getUsers,
  createUser
}
