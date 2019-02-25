import express from 'express'
import socketIO from 'socket.io'
import session from 'express-session'
import ConnectRedis from 'connect-redis'
import passport from 'passport'
import { config } from '../config/config'
import { initAuth } from './auth/auth'
import { loginHandler } from './auth/login'
import { requireAuth } from './auth/middleware'
import { events } from './socket/events'
import { connectRedis } from './actions/redis'
import { checkLogin } from './controllers/login'
import { logOut } from './controllers/logout'
import { getUsers, postUser } from './controllers/users'
import { getRooms, postRoom } from './controllers/rooms'
import { getMessages, postMessage } from './controllers/messages'
import { imAlive } from './controllers/root'

// Redis session store
const RedisStore = ConnectRedis(session)

// Initialize Session handling
const sessionMiddleware = session({
  store: new RedisStore({ client: connectRedis() }),
  name: config.sessionIdCookieName,
  secret: config.sessionSignSecret,
  resave: false,
  saveUninitialized: true
})

const app = express()
const server = app.listen(config.appListenPort)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(sessionMiddleware)

// Initialize Passport authentication
app.use(passport.initialize())
app.use(passport.session())
initAuth()

// Redis pub/sub & Socket.IO events
const io = socketIO(server)

// Session handling for our sockets
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next)
})

events(io)

// REST API routes
app.get('/', imAlive)
app.get('/api/logout', logOut)

app.get('/api/login', requireAuth(), checkLogin)
app.post('/api/login', loginHandler)

app.get('/api/messages', requireAuth(), getMessages)
app.post('/api/messages', requireAuth(), postMessage)

app.get('/api/rooms', requireAuth(), getRooms)
app.post('/api/rooms', requireAuth(), postRoom)

app.get('/api/users', requireAuth(), getUsers)
app.post('/api/users', postUser)

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Not found!' })
})

export default app
