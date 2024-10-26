const db = require('../config/database');

async function getAllModelVersions(req, res) {
    try {
        const [rows] = await db.promise().query('SELECT * FROM model_versions ORDER BY version_id DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las versiones de los modelos:', error);
        res.status(500).json({ error: 'Error al obtener las versiones de los modelos.' });
    }
}

async function getModelVersionById(req, res) {
    try {
        const modelId = req.params.id;

        // Consulta para obtener la versión del modelo por ID
        const [rows] = await db.promise().query('SELECT * FROM model_versions WHERE version_id = ?', [modelId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Versión del modelo no encontrada.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al obtener la versión del modelo:', error);
        res.status(500).json({ error: 'Error al obtener la versión del modelo.' });
    }
}

async function deleteModelVersion(req, res) {
    try {
        const modelId = req.params.id;

        // Verificar si la versión del modelo existe
        const [rows] = await db.promise().query('SELECT * FROM model_versions WHERE version_id = ?', [modelId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Versión del modelo no encontrada.' });
        }

        // Eliminar la versión del modelo
        await db.promise().query('DELETE FROM model_versions WHERE version_id = ?', [modelId]);

        res.status(200).json({ message: 'Versión del modelo eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar la versión del modelo:', error);
        res.status(500).json({ error: 'Error al eliminar la versión del modelo.' });
    }
}

module.exports = {
    getAllModelVersions,
    getModelVersionById,
    deleteModelVersion
};