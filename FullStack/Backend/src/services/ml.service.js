const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

const predictFromML = async (payload) => {
  const response = await axios.post(`${ML_API_URL}/predict`, payload);
  return response.data;
};

module.exports = { predictFromML };
