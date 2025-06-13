// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Falta token de autorización' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
  if (!secret) {
    console.error('❌ Falta SECRET_KEY o JWT_SECRET en .env');
    return res.status(500).json({ error: 'Configuración de servidor incompleta' });
  }

  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { authenticate };