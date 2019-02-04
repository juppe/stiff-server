import Redis from 'ioredis'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'

const pub = new Redis(redis_address)
const sub = new Redis(redis_address)

sub.subscribe('new_message', 'new_room', 'join_room', 'leave_room')

import { messages as messages_action } from '../actions'
const { listMessages, writeMessage } = messages_action

import { rooms as rooms_action } from '../actions'
const { listRooms } = rooms_action

export const events = io => {
  // Socket.IO
  io.on('connection', socket => {
    socket.on('join_room', room => {
      socket.join(room)

      // Send messages history when joining room
      listMessages(room).then(messages => {
        socket.emit('list_messages', messages)
      })
    })

    listRooms().then(rooms => {
      socket.emit('list_rooms', rooms)
    })

    socket.on('write_message', messageData => {
      const msgRoom = messageData.room
      const msgUser = socket.request.session.passport.user
      const msgDate = messageData.date
      const msgMessage = messageData.message

      /* Write message to database and publish it */
      writeMessage(msgRoom, msgUser, msgDate, msgMessage).then(
        pub.publish('new_message', JSON.stringify(messageData))
      )
    })

    /*
      Emit message to clients when someone publishes
      to any of our subscribed channles
    */
    sub.on('message', (channel, message) => {
      socket.emit(channel, message)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
}
