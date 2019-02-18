import { Router } from 'express'
import Redis from 'ioredis'
import { requireAuth } from '../auth'
import { users as users_action } from '../actions'
import { login as login_action } from '../actions'

const redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379'
const { createUser, listUsers } = users_action
const { loginHandler } = login_action

const router = Router()
const pub = new Redis(redis_address)

// GET users
router.get('/', requireAuth(), async (req, res) => {
  const users = await listUsers()
  res.send(users)
})

// POST user
router.post('/', async (req, res, next) => {
  const response = await createUser(
    req.body.username,
    req.body.nickname,
    req.body.password
  )

  // Publish and authenticate new user if creation was succesful
  if (response.status === 'OK') {
    await pub.publish(
      'new_user',
      JSON.stringify({
        username: req.body.username,
        nickname: req.body.nickname
      })
    )
    // Log in our new user
    loginHandler(req, res, next)
  } else {
    res.send(response)
  }
})

export const users = router
