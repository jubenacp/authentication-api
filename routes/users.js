const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieves all users (accessible only for admin users).
 *     tags: 
 *       - Admin
 *     security:
 *       - bearerAuth: []  # Ensure JWT authentication is defined
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: User ID.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: User's name.
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: User's email address.
 *                     example: johndoe@example.com
 *                   permission_id:
 *                     type: integer
 *                     description: User's permission level.
 *                     example: 1
 *       403:
 *         description: Access denied. The user does not have permission to access this resource.
 *       401:
 *         description: Invalid or missing token.
 *       500:
 *         description: Server error.
 */
router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;