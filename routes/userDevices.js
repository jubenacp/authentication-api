const express = require('express');
const router = express.Router();
const db = require('../config/database');
/**
 * @swagger
 * tags:
 *   name: User Devices
 */

/**
 * @swagger
 * /api/user_devices:
 *   get:
 *     summary: Get the list of devices associated with a user
 *     tags: [User Devices]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of devices successfully retrieved.
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
 *                   device_id:
 *                     type: string
 *                   device_type:
 *                     type: string
 *                   operating_system:
 *                     type: string
 *                   app_version:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Server error.
 */
router.get('/', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ msg: 'User ID is required' });
    }
    try {
        const [rows] = await db.query('SELECT * FROM user_devices WHERE user_id = ?', [user_id]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/user_devices/{device_id}:
 *   delete:
 *     summary: Delete a device associated with a user
 *     tags: [User Devices]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Device ID
 *     responses:
 *       200:
 *         description: Device successfully deleted.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Server error.
 */
router.delete('/:device_id', async (req, res) => {
    const { device_id } = req.params;
    if (!device_id) {
        return res.status(400).json({ msg: 'Device ID is required' });
    }
    try {
        await db.query('DELETE FROM user_devices WHERE device_id = ?', [device_id]);
        res.status(200).json({ msg: 'Device deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
