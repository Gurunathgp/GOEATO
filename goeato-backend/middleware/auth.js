const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../src/config');

function extractToken(req) {
  const bearer = req.header('authorization') || req.header('Authorization');
  if (bearer && bearer.startsWith('Bearer ')) return bearer.slice(7);
  return req.header('x-auth-token');
}

const auth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = { id: user._id.toString(), role: user.role };
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth };
