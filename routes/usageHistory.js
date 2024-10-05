const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @swagger
 * /api/usage_history:
 *   get:
 *     summary: Obtener el historial de uso
 *     responses:
 *       200:
 *         description: Historial de uso obtenido correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM app_usage_events');
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/usage_history:
 *   delete:
 *     summary: Eliminar registros del historial de uso
 *     responses:
 *       200:
 *         description: Historial de uso eliminado correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/', async (req, res) => {
    try {
        await db.query('DELETE FROM app_usage_events');
        res.status(200).json({ msg: 'Usage history deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


module.exports = router;