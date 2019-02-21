
// Check if we are logged in
export const checkLogin = (req, res, next) => {
  res.json({
    status: 'OK',
    message: 'You are logged in!'
  })
}
