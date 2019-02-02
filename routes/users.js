import { Router } from 'express'
var router = Router()

import { users } from '../actions'
const { createUser, getUsers } = users

/* GET users */
router.get('/', function(req, res) {
  getUsers().then(users => {
    res.send(users)
  })
})

/* CREATE user */
router.post('/', function(req, res) {
  createUser(req.body.username, req.body.fullname).then(result => {
    res.send({ response: 'User created!' })
  })
})

export default router
