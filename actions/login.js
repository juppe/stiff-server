import passport from 'passport'

const loginHandler = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      console.log(err)
      console.log(user)

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

export const login = {
  loginHandler
}
