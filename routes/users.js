import { Router } from 'express'
import { requireAuth } from '../auth'

var router = Router()

import { users as users_action } from '../actions'
const { createUser, listUsers } = users_action

/* GET users */
router.get('/', requireAuth(), async (req, res) => {
  const users = await listUsers()
  res.send(users)
})

/* CREATE user */
router.post('/', async (req, res) => {
  const result = await createUser(
    req.body.username,
    req.body.nickname,
    req.body.password
  )
  res.send({ response: result })
})

export const users = router
