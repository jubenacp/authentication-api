const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mlModelController = require('../controllers/mlModelController');

/**
 * @swagger
 * /api/mlmodel/train:
 *   post:
 *     summary: Train KNN model
 *     tags: [Machine Learning Model]
 *     description: This endpoint trains a KNN model using the provided data.
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
 *         description: Successful training
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
 *         description: Error in the data provided
 *       500:
 *         description: Internal Server Error
 */
router.post('/train', upload.single('file'), mlModelController.trainModel);

/**
 * @swagger
 * /api/mlmodel/predict:
 *   post:
 *     summary: Make predictions using the trained KNN model
 *     tags: [Machine Learning Model]
 *     description: This endpoint makes predictions based on the trained KNN model.
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
 *         description: Successful prediction
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
 *         description: Error in the data provided
 *       500:
 *         description: Internal Server Error
 */
router.post('/predict', upload.single('file'), mlModelController.predictModel);

module.exports = router;
