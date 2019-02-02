import { Router } from 'express'
const router = Router()

import { hello } from '../actions'
const { helloMessage } = hello

router.get('/', function(req, res) {
  const response = helloMessage()
  res.send({
    response: response
  })
})

export default router
