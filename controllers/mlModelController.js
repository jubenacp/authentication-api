const mlModelService = require('../services/mlModelService');
const TrainingSessionsModel = require('../models/trainingSessionsModel');
const path = require('path');
const db = require('../config/database');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

async function trainModel(req, res) {
    try {
        // Validación del token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: 'Token de autorización no proporcionado.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Token no encontrado.' });
        }

        let userId;
        try {
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ msg: 'Configuración del servidor incorrecta: JWT_SECRET no definido.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(403).json({ msg: 'Token inválido o expirado.' });
        }

        const updateModelVersionRaw = req.body.updateModelVersion || req.query.updateModelVersion;
        const updateModelVersion = req.body.updateModelVersion === 'true' || req.body.updateModelVersion === true || false;

        let data, trainingDataFile;
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            try {
                const convertedData = await mlModelService.convertTsvToJson(filePath);
                data = convertedData.data;
                trainingDataFile = req.file.originalname;
            } catch (validationError) {
                return res.status(400).json({ error: validationError.message });
            }
        } else {
            data = req.body;
            trainingDataFile = 'unknown';
        }

        // Utilizar la URL del modelo desde el archivo .env
        const result = await mlModelService.trainModel(data, updateModelVersion);

        // Adaptar el manejo de `modelVersion`
        if (!updateModelVersion && result.training_details.modelVersion) {
            delete result.training_details.modelVersion;
        }

        // Preparar datos para guardar la sesión de entrenamiento en la base de datos
        const trainingSessionData = {
            user_id: userId,
            timestamp: result.training_details.timestamp || new Date().toISOString(),
            duration: result.training_details.duration || 0,
            status: result.status || 'unknown',
            accuracy: result.metrics.accuracy,
            f1_score: result.metrics.f1_score,
            precision: result.metrics.precision,
            recall: result.metrics.recall,
            confusion_matrix: JSON.stringify(result.confusion_matrix),
            training_data_file: trainingDataFile,
            error_message: result.message || null,
            updateModelVersion: updateModelVersion // Incluir updateModelVersion en los datos para guardar
        };

        // Convertir el método createTrainingSession a una promesa
        const createTrainingSessionAsync = util.promisify(TrainingSessionsModel.createTrainingSession);

        // Guardar la sesión de entrenamiento en la base de datos
        await createTrainingSessionAsync(trainingSessionData);

        // Si updateModelVersion es true, actualizar la tabla model_versions
        if (updateModelVersion) {
            console.log("Llamando a handleModelVersionUpdate porque updateModelVersion es:", updateModelVersion);
            await handleModelVersionUpdate(result, trainingDataFile);
        } else {
            console.log("No se llamará a handleModelVersionUpdate porque updateModelVersion es:", updateModelVersion);
        }

        res.status(200).json(result);

    } catch (error) {
        console.error('Error en trainModel:', error);
        res.status(500).json({ error: 'Error entrenando el modelo.', details: error.message });
    }
}

async function handleModelVersionUpdate(result, trainingDataFile) {
    try {
        // Obtener el número de registros usados en el entrenamiento
        const dataSize = result.training_details.data_size || null;

        // Consultar la versión actual del modelo
        const [rows] = await db.promise().query('SELECT * FROM model_versions ORDER BY version_id DESC LIMIT 1');

        let newVersionNumber;

        if (rows.length === 0) {
            // No existe ninguna versión, crear la primera
            newVersionNumber = 'v1.0';
        } else {
            // Existe una versión, incrementar la versión mayor
            const currentVersion = rows[0].version_number;
            const versionParts = currentVersion.split('.');
            const majorVersion = parseInt(versionParts[0].substring(1), 10) + 1;

            newVersionNumber = `v${majorVersion}.0`;
        }

        const insertQuery = `
            INSERT INTO model_versions (
                model_type, version_number, best_k, data_size, training_data_file, created_at, model_path
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const modelType = result.training_details.model_type || 'unknown';
        const bestK = result.training_details.best_k || null;
        const modelPath = result.training_details.model_path || 'path/to/default_model';
        const createdAt = result.training_details.timestamp;

        await db.promise().query(insertQuery, [
            modelType,            // model_type
            newVersionNumber,     // version_number
            bestK,                // best_k
            dataSize,             // data_size
            trainingDataFile,     // training_data_file
            createdAt,            // created_at
            modelPath             // model_path
        ]);

        console.log(`Nueva versión del modelo creada: ${newVersionNumber}`);
    } catch (error) {
        console.error('Error al actualizar la versión del modelo:', error);
        throw error;
    }
}

async function predictModel(req, res) {
    try {
        let result;
        const modelUrl = `${process.env.ML_MODEL_URL}/predict`; // Utilizar la URL del modelo desde el archivo .env

        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            const updateModelVersion = req.body.updateModelVersion === 'true';
            const data = await mlModelService.convertTsvToJson(filePath);
            data.updateModelVersion = updateModelVersion;
            result = await mlModelService.predictModel(data, modelUrl);
        } else {
            const data = req.body;
            result = await mlModelService.predictModel(data, modelUrl);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Error en predictModel:', error);
        res.status(500).json({ error: 'Error haciendo predicción.', details: error.message });
    }
}

module.exports = {
    trainModel,
    predictModel,
};
