import moment from 'moment'

/* Hello message. */
const helloMessage = () => {
  const date = moment.now()
  const msg = `Hello the time is: ${date}`
  return msg
}

export const hello = {
  helloMessage
}
