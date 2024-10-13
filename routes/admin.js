const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/admin/permissions:
 *   get:
 *     summary: Get a list of all permissions
 *     description: Retrieve a list of all permissions available in the system. Only users with `admin_access` are authorized to use this endpoint.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   permission_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                     example: user_access
 *       401:
 *         description: Unauthorized - No valid token provided
 */

router.get('/permissions', authMiddleware, adminController.getPermissions);

/**
 * @swagger
 * /api/admin/assign-permission:
 *   post:
 *     summary: Assign a permission to a user
 *     description: Assign a specific permission to a user. Only users with `admin_access` are authorized to use this endpoint.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user to whom the permission will be assigned
 *                 example: 2
 *               permission_id:
 *                 type: integer
 *                 description: ID of the permission to assign
 *                 example: 1
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 *       400:
 *         description: Bad Request - Invalid user or permission ID
 *       401:
 *         description: Unauthorized - No valid token provided
 *       403:
 *         description: Forbidden - Only users with admin permission can assign permissions
 */

router.post('/assign-permission', authMiddleware, adminController.assignPermission);

module.exports = router;
