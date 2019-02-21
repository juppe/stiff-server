import { listRooms, createRoom } from '../actions/rooms'
import { connectRedis } from '../actions/redis'

const redis = connectRedis()

// GET rooms
export const getRooms = async (req, res, next) => {
  const rooms = await listRooms()
  res.send(rooms)
}

// POST room
export const postRoom = async (req, res, next) => {
  // Write room to database and publish
  const response = await createRoom(req.body.roomname)

  if (response.status === 'OK') {
    await redis.publish('new_room', JSON.stringify(req.body.roomname))
  }
  res.send(response)
}
