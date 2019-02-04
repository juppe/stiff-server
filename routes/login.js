import { Router } from 'express'
import { requireAuth } from '../auth'
import passport from 'passport'

var router = Router()

/* Check if we are logged in */
router.get('/', requireAuth(), (req, res) => {
  res.status(200).json({
    status: 'Login successful!'
  })
})

/* Login user */
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'Login unsuccessful!'
      })
    }
    req.login(user, err => {
      if (err) {
        return res.status(401).json({
          status: 'Login unsuccessful!'
        })
      }
      res.status(200).json({
        status: 'Login successful!'
      })
    })
  })(req, res, next)
})

export const login = router
