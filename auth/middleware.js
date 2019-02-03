export const requireAuth = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.sendStatus(401)
  }
}
