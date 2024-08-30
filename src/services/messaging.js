const { ensureToken } = require('./auth');
const axios = require('axios');
const { BASE_URL } = require('../config/env');

let jwtToken = null;
const userChains = {};

async function sendMessageWithToken(msg, userPhoneNumber) {
    try {
        jwtToken = await ensureToken(userPhoneNumber);

        const response = await axios.post(`${BASE_URL}/whatsapp`, {
            user_id: userPhoneNumber, 
            message: msg 
        }, {
            headers: {
                'Authorization': `${jwtToken}`
            }
        });

        return response.data.resposta;

    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Token inválido ou expirado, relogando...');
            jwtToken = null;
            return await sendMessageWithToken(msg, userPhoneNumber);
        } else {
            console.error('Erro ao enviar mensagem para o servidor:', error);
            return 'Erro ao enviar mensagem'
        }
    }
}

async function processMessageInChain(userPhoneNumber, msg) {
    if (!userChains[userPhoneNumber]) {
        userChains[userPhoneNumber] = Promise.resolve();
    }

    userChains[userPhoneNumber] = userChains[userPhoneNumber].then(async () => {
        const result = await handleMessage(userPhoneNumber, msg);
        return result;  
    }).catch(error => {
        console.error('Erro no processamento da mensagem:', error);
        return null;
    });

    return userChains[userPhoneNumber];
}

async function handleMessage(userPhoneNumber, msg) {
    await randomPause();

    const resposta = await sendMessageWithToken(msg, userPhoneNumber);

    await randomPause();

    return resposta;
}

async function randomPause() {
    const min = 1000; 
    const max = 2000; 
    const pauseTime = Math.floor(Math.random() * (max - min + 1)) + min;
    await sleep(pauseTime);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    sendMessageWithToken,
    processMessageInChain,
    handleMessage
};