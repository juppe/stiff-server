import { Router } from 'express'
import Redis from 'ioredis'
import { requireAuth } from '../auth'
import { rooms as rooms_action } from '../actions'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const { listRooms, createRoom } = rooms_action

const router = Router()
const pub = new Redis(redis_address)

/* GET rooms */
router.get('/', requireAuth(), (req, res) => {
  listRooms().then(rooms => {
    res.send(rooms)
  })
})

/* CREATE room */
router.post('/', requireAuth(), (req, res) => {
  createRoom(req.body.roomname).then(result => {
    pub.publish('new_room', req.body.roomname)
    res.send({ response: 'Room created!' })
  })
})

export const rooms = router
