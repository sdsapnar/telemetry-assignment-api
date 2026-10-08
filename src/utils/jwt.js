const jwt = require('jsonwebtoken');
const { authModal } = require('../modals');
const { ac, rs } = require('../constants');

function generateToken(user) {
  const payload = {
    user_id: user.user_id,
    client_id: user.client_id,
    role_id: user.role_id,
    user_name: user.user_name,
    user_email: user.user_email,
    role_name: user.role_name,
    client_name: user.client_name
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}

async function verifyToken(req, res, next) {
  try {
    const token = req.signedCookies?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) throw new Error(ac.message.tokenMissing);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const requiredClaims = ['user_id', 'client_id', 'role_id', 'user_name', 'user_email'];
    if (requiredClaims.some(claim => user[claim] === undefined || user[claim] === null)) {
      throw new Error('Session token is missing required identity data. Please login again.');
    }
    const activeSession = await authModal.getActiveToken(user.user_id);
    if (!activeSession || activeSession.active_token !== token || new Date(activeSession.token_valid_upto) <= new Date()) {
      throw new Error('Session expired or logged in from another device. Please login again.');
    }
    req.user = user;
    req.authToken = token;
    next();
  } catch (error) {
    res.clearCookie('token', { path: '/' });
    return res.status(ac.status.unauthorized).send(
      rs.getResponseStructure(ac.status.unauthorized, error.message || ac.message.unauthorized)
    );
  }
}

function getLoggedInUser(req) {
  if (req.user) return req.user;
  const token = req.signedCookies?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return token ? jwt.verify(token, process.env.JWT_SECRET) : null;
}

module.exports = { generateToken, verifyToken, getLoggedInUser };
