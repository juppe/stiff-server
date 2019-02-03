import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const listUsers = async () => {
  try {
    const data = await redis.hgetall('Users')
    const users = Object.keys(data).map(key => JSON.parse(data[key]))
    return users
  } catch (error) {
    console.log('Error fetching Users:', JSON.stringify(error, null, 2))
  }
}

const getUser = async (email) => {
  try {
    const data = await redis.hget('Users', email)
    const user = JSON.parse(data)
    return user
  } catch (error) {
    console.log('Error fetching User:', JSON.stringify(error, null, 2))
  }
}

const createUser = async (data) => {
  const userinfo = JSON.stringify({
    email: data.email,
    nickname: data.nickname,
    password: data.password
  })

  try {
    const response = await redis.hset('Users', data.email, userinfo)
    console.error('Created user:', response)
    return response
  } catch (error) {
    console.error('Unable to add user:', JSON.stringify(error, null, 2))
  }
}

export const users = {
  getUser,
  listUsers,
  createUser
}
