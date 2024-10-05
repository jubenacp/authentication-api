const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Asegúrate de que esta ruta es correcta

router.get('/:id', userController.getUserById);

module.exports = router;
