const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @swagger
 * /api/usage_history:
 *   get:
 *     summary: Get usage history
 *     tags: [Usage History]
 *     responses:
 *       200:
 *         description: Usage history successfully retrieved
 *       500:
 *         description: Internal server error
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
 *     summary: Delete usage history records
 *     tags: [Usage History]
 *     responses:
 *       200:
 *         description: Usage history successfully deleted
 *       500:
 *         description: Internal server error
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