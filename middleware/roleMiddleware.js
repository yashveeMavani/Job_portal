
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ message: 'Invalid access' });
  }
  next();
};

module.exports = { verifyToken, checkRole };