const connection = require('../config/database'); // Importa la conexión de la base de datos

function createTrainingSession(data, callback) {
    const {
        user_id,
        timestamp,
        duration,
        status,
        accuracy,
        f1_score,
        precision,
        recall,
        confusion_matrix,
        training_data_file,
        error_message
    } = data;

    const query = `
        INSERT INTO training_sessions 
        (user_id, timestamp, duration, status, accuracy, f1_score, \`precision\`, recall, confusion_matrix, training_data_file, error_message) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        user_id,
        timestamp,
        duration,
        status,
        accuracy,
        f1_score,
        precision,
        recall,
        JSON.stringify(confusion_matrix), // Convertir JSON a string para almacenar
        training_data_file,
        error_message
    ];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al crear la sesión de entrenamiento:', err);
            return callback(err);
        }
        callback(null, results);
    });
}

// Obtener una sesión de entrenamiento por ID
function getTrainingSessionById(session_id, callback) {
    const query = 'SELECT * FROM training_sessions WHERE session_id = ?';
    connection.query(query, [session_id], (err, results) => {
        if (err) {
            console.error('Error al obtener la sesión de entrenamiento:', err);
            return callback(err);
        }
        callback(null, results[0]);
    });
}

// Obtener todas las sesiones de entrenamiento
function getAllTrainingSessions(callback) {
    const query = 'SELECT * FROM training_sessions';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las sesiones de entrenamiento:', err);
            return callback(err);
        }
        callback(null, results);
    });
}

module.exports = {
    createTrainingSession,
    getTrainingSessionById,
    getAllTrainingSessions
};