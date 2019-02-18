import Redis from 'ioredis'

import { messages as messages_action } from '../actions'
const { listMessages } = messages_action

import { rooms as rooms_action } from '../actions'
const { listRooms, joinRoom } = rooms_action

import { users as users_action } from '../actions'
const { listUsers } = users_action

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const sub = new Redis(redis_address)
// Subscribe to Redis pub/sub channels
sub.subscribe('new_chat', 'new_room', 'new_user')

export const events = io => {
  // Socket.IO
  io.on('connection', socket => {
    try {
      const username = socket.request.session.passport.user
    } catch (e) {
      console.log("Not logged in!")
      return
    }

    // Join room and send all messages in room
    socket.on('join_room', async room => {
      socket.join(room)
      const username = socket.request.session.passport.user
      await joinRoom(room, username, socket.id)

      // Send messages history when joining room
      const messages = await listMessages(room)
      socket.emit('list_messages', messages)
    })

    // List all rooms
    socket.on('list_rooms', async () => {
      const rooms = await listRooms()
      socket.emit('list_rooms', rooms)
    })

    // List all users
    socket.on('list_users', async () => {
      const users = await listUsers()
      socket.emit('list_users', users)
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  // Emit message to clients when someone publishes
  // to any of our subscribed channels
  sub.on('message', async (channel, message) => {
    var mess = JSON.parse(message)
    if (channel == 'new_chat') {
      // Chat messages are emitted only to specific room
      io.in(mess.room).emit(channel, mess)
    } else {
      io.emit(channel, mess)
    }
  })
}
