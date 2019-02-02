import express from 'express'
import socketIO from 'socket.io'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = app.listen(process.env.PORT || 3001)
app.io = socketIO(server)

/* Routes to REST API and Socket.IO/Websockets endpoints */
const routes = require('./routes').default(app.io)

app.use('/', routes)

export default app
