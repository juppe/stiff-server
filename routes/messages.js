import { Router } from 'express'
const router = Router()

import { messages } from '../actions'
const { getMessages } = messages

/* GET messages */
router.get('/', function(req, res) {
  getMessages().then(messages => {
    res.send(messages)
  })
})

export default router
