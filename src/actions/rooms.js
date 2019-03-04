import { connectRedis } from './redis'
import { getUser, getUserByUUID } from './users'

const redis = connectRedis()

// List all rooms
export const listRooms = async () => {
  try {
    const data = await redis.hgetall('stiff:rooms')
    const rooms = Object.keys(data).map(key => JSON.parse(data[key]))
    return rooms
  } catch (error) {
    console.log('Error fetching Rooms:', JSON.stringify(error, null, 2))
  }
}

// Create new room
export const createRoom = async name => {
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

// Join room
export const joinRoom = async (room, username, socketid) => {
  try {
    // Fetch user info
    const user = await getUser(username)
    const rediskey = 'stiff:members:' + room
    await redis.hset(rediskey, user['uuid'], socketid)
  } catch (error) {
    console.error(
      'Unable to add member to room:',
      JSON.stringify(error, null, 2)
    )
  }
}

// Leave room
export const leaveRoom = async (room, username) => {
  try {
    // Fetch user info
    const user = await getUser(username)
    const rediskey = 'stiff:members:' + room
    await redis.hdel(rediskey, user['uuid'])
  } catch (error) {
    console.error(
      'Unable to remove member from room:',
      JSON.stringify(error, null, 2)
    )
  }
}

// List all room members
export const getRoomMembers = async room => {
  try {
    const rediskey = 'stiff:members:' + room
    const data = await redis.hgetall(rediskey)
    // Fetch users by UUID
    const users = await Promise.all(
      Object.keys(data).map(uuid => getUserByUUID(uuid))
    )
    const members = users.map(user => user.nickname)
    return members
  } catch (error) {
    console.log('Error fetching room members:', JSON.stringify(error, null, 2))
  }
}
