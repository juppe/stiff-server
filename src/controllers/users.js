import { createUser, listUsers } from '../actions/users'
import { loginHandler } from '../actions/login'
import { connectRedis } from '../actions/redis'

const redis = connectRedis()

// GET users
export const getUsers = async (req, res, next) => {
  const users = await listUsers()
  res.send(users)
}

// POST user
export const postUser = async (req, res, next) => {
  console.log("postUser")
  const response = await createUser(
    req.body.username,
    req.body.nickname,
    req.body.password
  )

  // Publish and authenticate new user if creation was succesful
  if (response.status === 'OK') {
    await redis.publish(
      'new_user',
      JSON.stringify({
        username: req.body.username,
        nickname: req.body.nickname
      })
    )
    // Log in our new user
    loginHandler(req, res, next)
  } else {
    res.send(response)
  }
}
