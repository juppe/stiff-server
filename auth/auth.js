import passport from 'passport'
import { compare } from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'

import { users as users_action } from '../actions'
const { getUser } = users_action

const findUser = async (email, callback) => {
  // Check for user in DB
  const user = await getUser(email)

  if (user && email === user.email) {
    return callback(null, user)
  }
  return callback(null, 'User not found')
}

passport.serializeUser((user, cb) => {
  cb(null, user.email)
})

passport.deserializeUser((email, cb) => {
  findUser(email, cb)
})

export const initAuth = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, done) => {
        findUser(email, (err, user) => {
          if (err) {
            return done(err)
          }

          // User not found
          if (!user) {
            console.log('User not found')
            return done(null, false)
          }

          return done(null, user)

          compare(password, user.password, (err, isValid) => {
            if (err) {
              return done(err)
            }
            if (!isValid) {
              return done(null, false)
            }

            console.log('Valid user found')
            return done(null, user)
          })
        })
      }
    )
  )
}
