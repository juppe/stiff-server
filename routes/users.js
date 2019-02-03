import { Router } from 'express'
import { requireAuth } from '../auth'

var router = Router()

import { users as users_action } from '../actions'
const { createUser, listUsers } = users_action

/* GET users */
router.get('/', requireAuth(), (req, res) => {
  listUsers().then(users => {
    res.send(users)
  })
})

/* CREATE user */
router.post('/', (req, res) => {
  const data = {
    email: req.body.email,
    nickname: req.body.nickname,
    password: req.body.password
  }
  createUser(data).then(result => {
    res.send({ response: result })
  })
})

export const users = router
