const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.register = (req, res) => {
    const { name, email, password, phone_number } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            db.query(
                'INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, phone_number],
                (err, result) => {
                    if (err) throw err;
                    const payload = {
                        user: {
                            id: result.insertId
                        }
                    };
                    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err;
                        res.json({ token });
                    });
                }
            );
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = results[0];

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'your_jwt_secret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    });
};
