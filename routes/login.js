import { Router } from 'express'
import { requireAuth } from '../auth'

import { login as login_action } from '../actions'
const { loginHandler } = login_action

var router = Router()

// Check if we are logged in
router.get('/', requireAuth(), (req, res) => {
  res.json({
    status: 'OK',
    message: 'You are logged in!'
  })
})

// Login user
router.post('/', loginHandler)

export const login = router
