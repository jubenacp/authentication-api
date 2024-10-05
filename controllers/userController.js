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
