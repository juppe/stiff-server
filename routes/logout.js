import { Router } from 'express'
import { requireAuth } from '../auth'

var router = Router()

// Logout user
router.get('/', requireAuth(), (req, res) => {
  console.log('LOGOUT. Bye bye!')
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

export const logout = router
