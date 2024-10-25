const db = require('../config/database');

exports.getPermissions = (req, res) => {
    // Verificar si el usuario tiene el permiso de admin_access
    if (req.user.permission_id !== 1) {
        return res.status(403).json({ msg: 'No tiene permisos para acceder a esta funcionalidad.' });
    }

    db.query('SELECT * FROM permissions', (err, results) => {
        if (err) {
            console.error('Error al obtener los permisos:', err);
            return res.status(500).json({ msg: 'Error en el servidor' });
        }
        res.status(200).json(results);
    });
};

exports.assignPermission = (req, res) => {
    const { user_id, permission_id } = req.body;

    if (req.user.permission_id !== 1) {
        return res.status(403).json({ msg: 'No tiene permisos para acceder a esta funcionalidad.' });
    }

    db.query('UPDATE users SET permission_id = ? WHERE id = ?', [permission_id, user_id], (err, result) => {
        if (err) {
            console.error('Error al asignar el permiso:', err);
            return res.status(500).json({ msg: 'Error en el servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        res.status(200).json({ msg: 'Permiso asignado correctamente.' });
    });
};
