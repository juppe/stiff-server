
// Check if we are logged in
export const imAlive = (req, res, next) => {
  res.json({ msg: "I'm alive!" })
}
