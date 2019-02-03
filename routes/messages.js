import { Router } from 'express'
import { requireAuth } from '../auth'

const router = Router()

import { messages as messages_action } from '../actions'
const { listMessages } = messages_action

/* GET messages */
router.get('/', requireAuth(), (req, res) => {
  listMessages().then(messages => {
    res.send(messages)
  })
})

export const messages = router
