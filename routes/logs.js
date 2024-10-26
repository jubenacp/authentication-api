const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para autenticar

/**
 * @swagger
 * /api/mlmodel/logs:
 *   get:
 *     summary: Get training sessions logs
 *     description: Retrieve a list of all training sessions (logs). Only users with a valid JWT are authorized to use this endpoint.
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of training sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   session_id:
 *                     type: integer
 *                     description: Unique identifier of the training session
 *                   user_id:
 *                     type: integer
 *                     description: Identifier of the user who initiated the training session
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the session was initiated
 *                   duration:
 *                     type: integer
 *                     description: Duration of the training session in seconds
 *                   status:
 *                     type: string
 *                     description: Status of the session (e.g., success or failure)
 *                   accuracy:
 *                     type: number
 *                     format: float
 *                     description: Accuracy metric of the trained model
 *                   f1_score:
 *                     type: number
 *                     format: float
 *                     description: F1 score of the trained model
 *                   precision:
 *                     type: number
 *                     format: float
 *                     description: Precision of the trained model
 *                   recall:
 *                     type: number
 *                     format: float
 *                     description: Recall metric of the trained model
 *                   confusion_matrix:
 *                     type: object
 *                     properties:
 *                       true_negatives:
 *                         type: integer
 *                       false_positives:
 *                         type: integer
 *                       false_negatives:
 *                         type: integer
 *                       true_positives:
 *                         type: integer
 *                   training_data_file:
 *                     type: string
 *                     description: Name of the training data file used
 *                   error_message:
 *                     type: string
 *                     description: Error message if the session failed
 *       401:
 *         description: Unauthorized - No valid token provided
 */
router.get('/', authMiddleware, logsController.getTrainingSessions);

module.exports = router;