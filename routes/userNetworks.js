const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @swagger
 * tags:
 *   name: User Networks
 *   description: API for managing user networks
 */

/**
 * @swagger
 * /api/user_networks:
 *   get:
 *     summary: Obtener el historial de redes de un usuario
 *     tags: [User Networks]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Historial de redes recuperado exitosamente.
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
 *                   ip_address:
 *                     type: string
 *                   network_type:
 *                     type: string
 *                   carrier:
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
        const [rows] = await db.query('SELECT * FROM user_networks WHERE user_id = ?', [user_id]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/user_networks/{network_id}:
 *   put:
 *     summary: Actualizar la información de una red de usuario
 *     tags: [User Networks]
 *     parameters:
 *       - in: path
 *         name: network_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la red
 *       - in: body
 *         name: body
 *         description: Datos de la red a actualizar
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             ip_address:
 *               type: string
 *             network_type:
 *               type: string
 *             carrier:
 *               type: string
 *     responses:
 *       200:
 *         description: Red actualizada exitosamente.
 *       400:
 *         description: Petición inválida.
 *       500:
 *         description: Error del servidor.
 */
router.put('/:network_id', async (req, res) => {
    const { network_id } = req.params;
    const { ip_address, network_type, carrier } = req.body;
    if (!network_id || !ip_address || !network_type || !carrier) {
        return res.status(400).json({ msg: 'Network ID, IP Address, Network Type and Carrier are required' });
    }
    try {
        await db.query('UPDATE user_networks SET ip_address = ?, network_type = ?, carrier = ? WHERE id = ?', 
            [ip_address, network_type, carrier, network_id]);
        res.status(200).json({ msg: 'Network updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
