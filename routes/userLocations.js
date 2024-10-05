const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @swagger
 * tags:
 *   name: User Locations
 *   description: API for managing user locations
 */

/**
 * @swagger
 * /api/user_locations:
 *   get:
 *     summary: Obtener el historial de ubicaciones de un usuario
 *     tags: [User Locations]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Historial de ubicaciones recuperado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   latitude:
 *                     type: number
 *                     format: float
 *                   longitude:
 *                     type: number
 *                     format: float
 *                   location_accuracy:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Petición inválida.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ msg: 'User ID is required' });
    }
    try {
        const [rows] = await db.query('SELECT * FROM user_locations WHERE user_id = ?', [user_id]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
