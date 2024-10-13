const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

exports.register = (req, res) => {
    const { name, email, password, phone_number } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ msg: 'Error en el servidor' });
        }
        if (results.length > 0) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        } else {
            db.query('SELECT permission_id FROM permissions WHERE name = ?', ['user_access'], (err, permissionResults) => {
                if (err) {
                    console.error('Error al obtener el permiso:', err);
                    return res.status(500).json({ msg: 'Error en el servidor' });
                }
                if (permissionResults.length === 0) {
                    return res.status(500).json({ msg: 'Permiso no encontrado' });
                }

                const permission_id = permissionResults[0].permission_id;
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);

                // Insertar el nuevo usuario con el permiso por defecto
                db.query(
                    'INSERT INTO users (name, email, password, phone_number, permission_id) VALUES (?, ?, ?, ?, ?)',
                    [name, email, hashedPassword, phone_number, permission_id],
                    (err, result) => {
                        if (err) {
                            console.error('Error al insertar el usuario:', err);
                            return res.status(500).json({ msg: 'Error en el servidor' });
                        }
                        const payload = {
                            id: result.insertId // Esto debe coincidir con la verificación
                        };
                        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                            if (err) {
                                console.error('Error al firmar el token:', err);
                                return res.status(500).json({ msg: 'Error en el servidor' });
                            }
                            res.json({ token });
                        });
                    }
                );
            });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ msg: 'Error en el servidor' });
        }
        if (results.length === 0) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const user = results[0];

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = {
            id: user.id // Esto debe coincidir con la verificación
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error al firmar el token:', err);
                return res.status(500).json({ msg: 'Error en el servidor' });
            }
            res.json({ token });
        });
    });
};