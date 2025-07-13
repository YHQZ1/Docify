const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const decodeToken = (token) => jwt.decode(token);

module.exports = { generateToken, verifyToken, decodeToken };