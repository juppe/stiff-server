import { Router } from 'express'
import { requireAuth } from '../auth'
import passport from 'passport'

var router = Router()

/* Check if we are logged in */
router.get('/', requireAuth(), function(req, res){
  res.status(200).json({
      status: 'Login successful!'
  });
});

/* Login user */
router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (info) {
      return res.send(JSON.stringify(info.message))
    }
    if (err) {
      return next(err)
    }
    if (!user) {
      console.log("Not logged in")
      return res.redirect('/api/hello')
    }
    req.login(user, err => {
      if (err) {
        return next(err)
      }
      console.log("I'm already logged in!"+ JSON.stringify(user))
      return res.redirect('/api/hello')
    })
  })(req, res, next)
})

export const login = router
