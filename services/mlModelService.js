const axios = require('axios');
const csv = require('csvtojson');
const fs = require('fs');

const apiTrainUrl = 'http://localhost:5000/train';
const apiPredictionUrl = 'http://localhost:5000/predict';


async function convertTsvToJson(filePath) {
  const jsonArray = await csv({ delimiter: '\t' }).fromFile(filePath);

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

  return formattedData;
}

async function trainModel(data) {
    try {
        const response = await axios.post(apiTrainUrl, { data });
        return response.data;
    } catch (error) {
        console.error('Error enviando datos a Flask:', error);
        throw error;
    }
}

async function predictModel(data) {
  try {
      const response = await axios.post(apiPredictionUrl, { data });
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
