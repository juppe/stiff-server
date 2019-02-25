import passport from 'passport'

// Login handler for passport authentication
export const loginHandler = (req, res, next) => {

  console.log("loginHandler")

  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Login unsuccessful!'
      })
    }
    req.login(user, err => {
      if (err) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'Login unsuccessful!'
        })
      }
      res.json({
        status: 'OK',
        message: 'Login successful!'
      })
    })
  })(req, res, next)
}
