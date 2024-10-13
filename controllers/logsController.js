const db = require('../config/database');

// Función para obtener todas las sesiones de entrenamiento del usuario autenticado
exports.getTrainingSessions = async (req, res) => {
    try {
        // `user` está disponible en `req` gracias al middleware de autenticación
        const userId = req.user.id;

        const query = 'SELECT * FROM training_sessions WHERE user_id = ?';
        
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error al obtener las sesiones de entrenamiento:', err);
                return res.status(500).json({ msg: 'Error al obtener las sesiones de entrenamiento.' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error en getTrainingSessions:', error);
        res.status(500).json({ msg: 'Error al procesar la solicitud.' });
    }
};