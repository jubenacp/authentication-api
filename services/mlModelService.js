const axios = require('axios');
const csv = require('csvtojson');
const fs = require('fs');
require('dotenv').config();

const apiTrainUrl = `${process.env.ML_MODEL_URL}/train`;
const apiPredictionUrl = `${process.env.ML_MODEL_URL}/predict`;

async function convertTsvToJson(filePath) {
    const jsonArray = await csv({ delimiter: '\t' }).fromFile(filePath);

    // Extraer el user_id del primer registro
    let userId = 'unknown';
    if (jsonArray.length > 0 && jsonArray[0].user_id) {
        userId = parseInt(jsonArray[0].user_id, 10);
    }

    const formattedData = jsonArray.map(record => ({
        user_id: parseInt(record.user_id, 10),
        session_id: parseInt(record.session_id, 10),
        is_authenticated: parseInt(record.is_authenticated, 10),
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
            updateModelVersion: updateModelVersion
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
