const axios = require('axios');
const { BASE_URL, COMMON_PASSWORD } = require('../config/env');

let jwtToken = null;

async function loginAndGetToken(userPhoneNumber) {
    try {
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            user_id: userPhoneNumber,
            password: COMMON_PASSWORD
        });

        return loginResponse.data.token;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
}

async function ensureToken(userPhoneNumber) {
    if (!jwtToken) {
        console.log('Nenhum token JWT encontrado, fazendo login...');
        jwtToken = await loginAndGetToken(userPhoneNumber);
    }
    return jwtToken;
}

module.exports = {
    ensureToken
};
