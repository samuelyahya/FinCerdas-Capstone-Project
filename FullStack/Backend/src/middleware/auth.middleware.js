const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak ditemukan, silakan login',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Token tidak valid atau sudah expired',
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
