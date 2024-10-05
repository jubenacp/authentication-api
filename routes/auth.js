const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Actualizar información del usuario
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Información del usuario
 *         schema:
 *           type: object
 *           required:
 *             - user_id
 *             - name
 *             - email
 *             - phone_number
 *           properties:
 *             user_id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone_number:
 *               type: string
 *     responses:
 *       200:
 *         description: Información del usuario actualizada exitosamente
 *       400:
 *         description: Faltan datos necesarios
 *       500:
 *         description: Error del servidor
 */
router.put('/update', async (req, res) => {
    const { user_id, name, email, phone_number } = req.body;
    if (!user_id || !name || !email || !phone_number) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    try {
        await db.query('UPDATE users SET name = ?, email = ?, phone_number = ? WHERE id = ?', [name, email, phone_number, user_id]);
        res.status(200).json({ msg: 'User information updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
