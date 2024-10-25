const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', userController.getUserById);

router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;