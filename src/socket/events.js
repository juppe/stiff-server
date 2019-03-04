import * as R from 'ramda'
import { listMessages } from '../actions/messages'
import { listRooms, joinRoom, getRoomMembers } from '../actions/rooms'
import { listUsers } from '../actions/users'
import { connectRedis } from '../actions/redis'

// Subscribe to Redis pub/sub channels
const redis = connectRedis()
redis.subscribe('new_chat', 'new_room', 'new_user')

export const events = io => {
  // Socket.IO
  io.on('connection', socket => {
    // Check if user has a session and is logged in
    const sessionUser = R.path(['session', 'passport', 'user'], socket.request)

    // Return nothing if user is not logger in
    if (sessionUser === undefined) {
      console.log('Not logged in!')
      return
    }

    // Join room and send all messages in room
    socket.on('join_room', async room => {
      socket.join(room)
      await joinRoom(room, sessionUser, socket.id)

      // Send messages history when joining room
      const messages = await listMessages(room)
      socket.emit('messages_list', messages)
    })

    // List all members/users in room
    socket.on('room_members', async room => {
      const members = await getRoomMembers(room)
      socket.emit('members_list', members)
    })

    // List all rooms
    socket.on('list_rooms', async () => {
      const rooms = await listRooms()
      socket.emit('rooms_list', rooms)
    })

    // List all users
    socket.on('list_users', async () => {
      const users = await listUsers()
      socket.emit('users_list', users)
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  // Emit message to clients when someone publishes
  // to any of our subscribed channels
  redis.on('message', async (channel, message) => {
    var mess = JSON.parse(message)
    if (channel == 'new_chat') {
      // Chat messages are emitted only to specific room
      io.in(mess.room).emit(channel, mess)
    } else {
      io.emit(channel, mess)
    }
  })
}
