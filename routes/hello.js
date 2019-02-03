import { Router } from 'express'

const router = Router()

import { hello as hello_action } from '../actions'
const { helloMessage } = hello_action

router.get('/', (req, res) => {
  const response = helloMessage()
  res.send({
    response: response
  })
})

export const hello = router
