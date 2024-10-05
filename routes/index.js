const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
router.get('/', (req, res) => {
  res.send('Welcome to the Authentication API');
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Returns a health check message.
 */
router.get('/health', (req, res) => {
  res.send('API is up and running');
});

module.exports = router;
