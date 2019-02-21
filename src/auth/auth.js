import passport from 'passport'
import { compare } from 'bcrypt'
import { Strategy } from 'passport-local'
import { getUser } from '../actions/users'

const findByUsername = async (username, done) => {
  // Check for user in DB
  const user = await getUser(username)
  if (user) {
    return done(null, user)
  }
  done(null, false)
}

passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser((username, done) => {
  findByUsername(username, done)
})

export const initAuth = () => {
  passport.use(
    new Strategy((username, password, done) => {
      findByUsername(username, (err, user) => {
        if (err || !user.username) {
          return done(err, false)
        }

        compare(password, user.password, (err, isValid) => {
          if (err || !isValid) {
            return done(err, false)
          }
          done(null, user)
        })
      })
    })
  )
}
