const express = require('express');
const router = express.Router();
const modelVersionsController = require('../controllers/modelVersionsController');

/**
 * @swagger
 * /api/mlmodel/models:
 *   get:
 *     summary: Get all model versions
 *     description: Retrieve a list of all versions of the machine learning model.
 *     tags: [Machine Learning Model]
 *     responses:
 *       200:
 *         description: A list of all model versions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version_id:
 *                     type: integer
 *                     description: Unique identifier for the model version
 *                   model_name:
 *                     type: string
 *                     description: Name of the model
 *                   version_number:
 *                     type: string
 *                     description: Version number (e.g., v1.0, v2.0)
 *                   architecture_changes:
 *                     type: string
 *                     description: Description of changes made to the model architecture
 *                   features_added:
 *                     type: string
 *                     description: New features added in this version
 *                   hyperparameter_tuning:
 *                     type: string
 *                     description: Description of any hyperparameter tuning done
 *                   data_tags:
 *                     type: string
 *                     description: Information on data tags or changes in data labeling
 *                   training_data_summary:
 *                     type: string
 *                     description: Summary of the training data used
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when this version was created
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when this version was last updated
 *                   model_path:
 *                     type: string
 *                     description: Path to the model file
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mlmodel/models/{id}:
 *   get:
 *     summary: Get model version by ID
 *     description: Retrieve details of a specific model version by providing the version ID.
 *     tags: [Machine Learning Model]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the model version to retrieve
 *     responses:
 *       200:
 *         description: Details of the requested model version
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version_id:
 *                   type: integer
 *                   description: Unique identifier for the model version
 *                 model_name:
 *                   type: string
 *                   description: Name of the model
 *                 version_number:
 *                   type: string
 *                   description: Version number (e.g., v1.0, v2.0)
 *                 architecture_changes:
 *                   type: string
 *                   description: Description of changes made to the model architecture
 *                 features_added:
 *                   type: string
 *                   description: New features added in this version
 *                 hyperparameter_tuning:
 *                   type: string
 *                   description: Description of any hyperparameter tuning done
 *                 data_tags:
 *                   type: string
 *                   description: Information on data tags or changes in data labeling
 *                 training_data_summary:
 *                   type: string
 *                   description: Summary of the training data used
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when this version was created
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when this version was last updated
 *                 model_path:
 *                   type: string
 *                   description: Path to the model file
 *       400:
 *         description: Model version not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mlmodel/models/{id}:
 *   delete:
 *     summary: Delete model version by ID
 *     description: Delete a specific model version by providing the version ID.
 *     tags: [Machine Learning Model]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the model version to delete
 *     responses:
 *       200:
 *         description: Model version deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message for successful deletion
 *       404:
 *         description: Model version not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message if the model version ID does not exist
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for server issues
 */

router.get('/', modelVersionsController.getAllModelVersions);
router.get('/:id', modelVersionsController.getModelVersionById);
router.delete('/:id', modelVersionsController.deleteModelVersion);

module.exports = router;
