import Redis from 'ioredis'
import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const listUsers = async () => {
  try {
    const data = await redis.hgetall('stiff:users')
    const users = Object.keys(data).map(key => {
      var dt = JSON.parse(data[key])
      return {
        username: dt.username,
        nickname: dt.nickname
      }
    })

    return users
  } catch (error) {
    console.log('Error fetching Users:', JSON.stringify(error, null, 2))
  }
}

const getUser = async username => {
  try {
    const data = await redis.hget('stiff:users', username)
    const user = JSON.parse(data)
    return user
  } catch (error) {
    console.log('Error fetching User:', JSON.stringify(error, null, 2))
  }
}

const getUserByUUID = async uuid => {
  try {
    const username = await redis.hget('stiff:uuid', uuid)
    const user = await getUser(username)
    return user
  } catch (error) {
    console.log('Error fetching User by uuid:', JSON.stringify(error, null, 2))
  }
}

const createUser = async (username, nickname, password) => {
  /* Create password hash */
  const password_hash = bcrypt.hashSync(password, 10)
  const uuid = uuidv4()

  const userinfo = JSON.stringify({
    uuid: uuid,
    username: username,
    nickname: nickname,
    password: password_hash
  })

  try {
    await Promise.all([
      redis.hset('stiff:uuid', uuid, username),
      redis.hset('stiff:users', username, userinfo)
    ])
  } catch (error) {
    console.error('Unable to add user:', JSON.stringify(error, null, 2))
  }
}

export const users = {
  getUser,
  getUserByUUID,
  listUsers,
  createUser
}
