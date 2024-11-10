const axios = require('axios');
const csv = require('csvtojson');
const fs = require('fs');
require('dotenv').config();

const apiTrainUrl = `${process.env.ML_MODEL_URL}/train`;
const apiPredictionUrl = `${process.env.ML_MODEL_URL}/predict`;

async function convertTsvToJson(filePath) {
    const jsonArray = await csv({ delimiter: '\t' }).fromFile(filePath);

    // Validar que no haya campos vacíos o incorrectos
    for (const [index, record] of jsonArray.entries()) {
        if (!record.user_id || isNaN(parseInt(record.user_id, 10))) {
            throw new Error(`Campo 'user_id' vacío o incorrecto en el registro ${index + 1}`);
        }
        if (!record.session_id || isNaN(parseInt(record.session_id, 10))) {
            throw new Error(`Campo 'session_id' vacío o incorrecto en el registro ${index + 1}`);
        }
        if (!record.timestamp || typeof record.timestamp !== 'string') {
            throw new Error(`Campo 'timestamp' vacío o incorrecto en el registro ${index + 1}`);
        }
        if (!record.app_name || typeof record.app_name !== 'string') {
            throw new Error(`Campo 'app_name' vacío o incorrecto en el registro ${index + 1}`);
        }
        if (!record.event_type || typeof record.event_type !== 'string') {
            throw new Error(`Campo 'event_type' vacío o incorrecto en el registro ${index + 1}`);
        }
    }

    // Extraer el user_id del primer registro
    let userId = 'unknown';
    if (jsonArray.length > 0 && jsonArray[0].user_id) {
        userId = parseInt(jsonArray[0].user_id, 10);
    }

    const formattedData = jsonArray.map(record => ({
        user_id: parseInt(record.user_id, 10),
        session_id: parseInt(record.session_id, 10),
        usage_history: [
            {
                timestamp: record.timestamp,
                app_name: record.app_name,
                event_type: record.event_type
            }
        ]
    }));

    // Eliminar el archivo después de procesarlo
    fs.unlinkSync(filePath);

    // Devolver el JSON y el user_id
    return {
        data: formattedData,
        user_id: userId
    };
}

async function trainModel(data, updateModelVersion) {
    try {
        const requestBody = {
            data: data,
            updateModelVersion: Boolean(updateModelVersion)
        };

        const response = await axios.post(apiTrainUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error enviando datos a Flask:', error);
        throw error;
    }
}

async function predictModel(data) {
    try {
        const response = await axios.post(apiPredictionUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error haciendo predicción con Flask:', error);
        throw error;
    }
}

module.exports = {
    trainModel,
    predictModel,
    convertTsvToJson
};
