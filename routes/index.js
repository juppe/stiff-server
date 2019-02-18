import express from 'express'

// Import routes
import { users } from './users'
import { rooms } from './rooms'
import { login } from './login'
import { logout } from './logout'
import { messages } from './messages'

const app = express()

app.get('/', (req, res) => {
  res.json({ msg: "I'm alive!" })
})

app.use('/api/users', users)
app.use('/api/rooms', rooms)
app.use('/api/login', login)
app.use('/api/logout', logout)
app.use('/api/messages', messages)

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Not found!' })
})

export const routes = app
