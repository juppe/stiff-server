// Authenication middleware for protected routes
export const requireAuth = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.status(401).json({
      status: 'ERROR',
      message: 'Not authenticated!'
    })
  }
}
