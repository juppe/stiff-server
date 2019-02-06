import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'

const pub = new Redis(redis_address)
const sub = new Redis(redis_address)

sub.subscribe('new_chat', 'new_room')

import { messages as messages_action } from '../actions'
const { listMessages } = messages_action

import { rooms as rooms_action } from '../actions'
const { listRooms, joinRoom } = rooms_action

export const events = io => {
  // Socket.IO
  io.on('connection', socket => {
    socket.on('join_room', async room => {
      // Join room
      socket.join(room)
      const username = socket.request.session.passport.user
      await joinRoom(room, username, socket.id)

      // Send messages history when joining room
      const messages = await listMessages(room)
      socket.emit('list_messages', messages)
    })

    socket.on('list_rooms', async () => {
      const rooms = await listRooms()
      socket.emit('list_rooms', rooms)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  /*
    Emit message to clients when someone publishes
    to any of our subscribed channels
  */
  sub.on('message', async (channel, message) => {
    if (channel == 'new_chat') {
      /* Chat messages are emitted only to specific room */
      const mess = JSON.parse(message)
      io.in(mess.room).emit(channel, message)
    } else {
      io.emit(channel, message)
    }
  })
}
