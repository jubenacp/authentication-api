const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mlModelController = require('../controllers/mlModelController');

/**
 * @swagger
 * /train:
 *   post:
 *     summary: Entrenar el modelo KNN
 *     description: Este endpoint entrena un modelo KNN usando los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     session_id:
 *                       type: integer
 *                     usage_history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                           app_name:
 *                             type: string
 *                           event_type:
 *                             type: string
 *     responses:
 *       200:
 *         description: Entrenamiento exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accuracy:
 *                   type: number
 *                 classification_report:
 *                   type: object
 *                 confusion_matrix:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       type: integer
 *       400:
 *         description: Error en los datos proporcionados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/train', upload.single('file'), mlModelController.trainModel);

/**
 * @swagger
 * /predict:
 *   post:
 *     summary: Realizar predicciones usando el modelo KNN entrenado
 *     description: Este endpoint realiza predicciones basadas en el modelo KNN entrenado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     session_id:
 *                       type: integer
 *                     usage_history:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                           app_name:
 *                             type: string
 *                           event_type:
 *                             type: string
 *     responses:
 *       200:
 *         description: Predicción exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predictions:
 *                   type: array
 *                   items:
 *                     type: number
 *       400:
 *         description: Error en los datos proporcionados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/predict', upload.single('file'), mlModelController.predictModel);

module.exports = router;
