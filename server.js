import express from 'express'
import socketIO from 'socket.io'
import session from 'express-session'
import ConnectRedis from 'connect-redis'
import Redis from 'ioredis'
import passport from 'passport'

const app = express()
const server = app.listen(process.env.PORT || 3001)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Initialize Session handling */
const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const redis = new Redis(redis_address)
const RedisStore = ConnectRedis(session)

app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: 'iso siika karva hauki',
    resave: false,
    saveUninitialized: true
  })
)

/* Initialize Passport authentication */
import { initAuth } from './auth'
app.use(passport.initialize())
app.use(passport.session())
initAuth(app)

/* Handle REST API routes */
import { routes } from './routes'
app.use('/', routes)

/* Handle Redis pubsub / Socket-io events */
const io = socketIO(server)
import { events } from './events'
events(io)

export default app
