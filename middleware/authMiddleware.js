require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../config/database');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'Configuración del servidor incorrecta: JWT_SECRET no definido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id ? decoded.id : decoded.user.id;

    db.query('SELECT permission_id FROM users WHERE id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        return res.status(500).json({ msg: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }

      req.user = {
        id: userId,
        permission_id: results[0].permission_id
      };

      next();
    });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
