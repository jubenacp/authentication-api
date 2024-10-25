const db = require('../config/database');

exports.getUserById = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(results[0]);
    });
};

exports.getAllUsers = (req, res) => {
    // Verificar si el usuario tiene permiso (permission_id = 1)
    if (req.user.permission_id !== 1) {
        return res.status(403).json({ msg: 'El usuario no cuenta con permisos suficientes para acceder a este recurso.' });
    }

    // Consulta para obtener todos los usuarios
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error en la consulta de usuarios:', err);
            return res.status(500).json({ msg: 'Error en el servidor' });
        }

        res.json(results);
    });
};