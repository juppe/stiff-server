import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)

const listRooms = async () => {
  try {
    const data = await redis.hgetall('stiff:rooms')
    const rooms = Object.keys(data).map(key => JSON.parse(data[key]))
    return rooms
  } catch (error) {
    console.log('Error fetching Rooms:', JSON.stringify(error, null, 2))
  }
}

const createRoom = async name => {
  const roomName = JSON.stringify(name)
  try {
    // Check if room exists
    const exists = await redis.hexists('stiff:rooms', roomName)

    if (exists === 1) {
      return { status: 'ERROR', message: 'Room exists' }
    }
    // Create room
    const response = await redis.hset('stiff:rooms', roomName, roomName)

    if (response === 1) {
      return { status: 'OK', message: 'Room created' }
    }
    return { status: 'ERROR', message: 'Error creating room' }
  } catch (error) {
    console.error('Error creating user:', JSON.stringify(error, null, 2))
    return {
      status: 'ERROR',
      message: 'Error creating room: ' + JSON.stringify(error)
    }
  }
}

const joinRoom = async (room, username, socketid) => {
  try {
    const rediskey = 'stiff:members:' + room
    await redis.hset(rediskey, username, socketid)
  } catch (error) {
    console.error(
      'Unable to add member to room:',
      JSON.stringify(error, null, 2)
    )
  }
}

const leaveRoom = async () => {}

const getRoomMembers = async room => {
  try {
    const rediskey = 'stiff:members:' + room
    const data = await redis.hgetall(rediskey)
    return data
  } catch (error) {
    console.log('Error fetching room members:', JSON.stringify(error, null, 2))
  }
}

export const rooms = {
  listRooms,
  createRoom,
  joinRoom,
  leaveRoom,
  getRoomMembers
}
