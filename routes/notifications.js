const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Send notifications to users
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification sent successfully
 */
router.post('/', (req, res) => {
  const { userId, message } = req.body;
  res.json({ msg: 'Notification sent successfully' });
});

module.exports = router;
