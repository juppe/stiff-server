import { Router } from 'express'
import Redis from 'ioredis'
import passport from 'passport'
import { requireAuth } from '../auth'
import { users as users_action } from '../actions'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const { createUser, listUsers } = users_action

const router = Router()
const pub = new Redis(redis_address)

/* GET users */
router.get('/', requireAuth(), async (req, res) => {
  const users = await listUsers()
  res.send(users)
})

/* CREATE user */
router.post('/', async (req, res, next) => {
  const result = await createUser(
    req.body.username,
    req.body.nickname,
    req.body.password
  )

  await pub.publish(
    'new_user',
    JSON.stringify({
      username: req.body.username,
      nickname: req.body.nickname
    })
  )

  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      console.log('Login unsuccessful!')
    }
    req.login(user, err => {
      if (err) {
        console.log('Login unsuccessful!' + err)
      }
      res.status(200).json({
        status: 'Login successful!'
      })
    })
  })(req, res, next)
})

export const users = router
