
// Logout user
export const logOut = (req, res, next) => {
  console.log('LOGOUT. Bye bye!')
  req.logout()
  req.session.destroy()
  res.redirect('/')
}
