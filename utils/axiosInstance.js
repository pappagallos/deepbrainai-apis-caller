const axios = require('axios');
const env = require('dotenv');

env.config();

const axiosInstance = axios.create({
    baseURL: process.env.DEEPBRAINAI_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

module.exports = axiosInstance;