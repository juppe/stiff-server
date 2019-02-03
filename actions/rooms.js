import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const listRooms = async () => {
  try {
    const data = await redis.hgetall('Rooms')
    const rooms = Object.keys(data).map(key => JSON.parse(data[key]))
    return rooms
  } catch (error) {
    console.log('Error fetching Rooms:', JSON.stringify(error, null, 2))
  }
}

const createRoom = async name => {
  try {
    const data = await redis.hset('Rooms', name, JSON.stringify(name))
    return data
  } catch (error) {
    console.error('Unable to add room:', JSON.stringify(error, null, 2))
  }
}

const joinRoom = async () => {
}

const leaveRoom = async () => {
}

const getRoomUsers = async () => {
}

export const rooms = {
  listRooms,
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomUsers
}
