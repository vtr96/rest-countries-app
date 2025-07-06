const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ mensagem: 'Token not provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido' })
  }
}
