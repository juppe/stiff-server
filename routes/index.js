import express from 'express'
/* Import routes */
import { default as hello } from './hello'
import { default as users } from './users'
import { default as messages } from './messages'
/* Import funtions for Socket handling */
import { messages as msg_actions } from '../actions'
const { writeMessage } = msg_actions

const app = express()

app.get('/', function(req, res) {
  res.json({ msg: "I'm alive!" })
})

app.use('/api/hello', hello)
app.use('/api/users', users)
app.use('/api/messages', messages)

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Not found!' })
})

export default io => {
  // Socket.IO
  io.on('connection', socket => {
    console.log('User connected')

    socket.on('send_message', data => {
      io.emit('receive_message', data)
      writeMessage(data)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  return app
}
