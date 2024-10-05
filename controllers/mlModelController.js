const mlModelService = require('../services/mlModelService');
const path = require('path');
const fs = require('fs');

// Controlador para entrenar el modelo desde un archivo TSV
async function trainModel(req, res) {
    try {
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            const data = await mlModelService.convertTsvToJson(filePath);
            const result = await mlModelService.trainModel(data, 'http://localhost:5000/train');
            res.status(200).json(result);
        } else {
            const data = req.body;
            const result = await mlModelService.trainModel(data, 'http://localhost:5000/train');
            res.status(200).json(result);
        }
    } catch (error) {
        console.error('Error en trainModel:', error);
        res.status(500).json({ error: 'Error entrenando el modelo con Flask.', details: error.message });
    }
}

// Controlador para hacer predicciones desde un archivo TSV
async function predictModel(req, res) {
    try {
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            const data = await mlModelService.convertTsvToJson(filePath);
            const result = await mlModelService.predictModel(data, 'http://localhost:5000/predict');
            res.status(200).json(result);
        } else {
            const data = req.body;
            const result = await mlModelService.predictModel(data, 'http://localhost:5000/predict');
            res.status(200).json(result);
        }
    } catch (error) {
        console.error('Error en predictModel:', error); // Esto imprimirá el error completo en la consola
        res.status(500).json({ error: 'Error haciendo predicción con Flask.', details: error.message });
    }
}

module.exports = {
    trainModel,
    predictModel,
};
