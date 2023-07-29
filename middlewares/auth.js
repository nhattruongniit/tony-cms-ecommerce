const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if(!token) {
    res.status(403).json({
      message: 'Access Denied',
      isSuccess: false
    })
    return;
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: 'Invalid token'
    })
  }
}