const { ensureToken } = require('./auth');
const axios = require('axios');
const { BASE_URL } = require('../config/env');
const { handleRateLimitAndMessageLength } = require('./rateLimit');
const { isUserInBlacklist, isUserBlocked } = require('./state');
const { handleBotControl } = require('./control')

let jwtToken = null;
const userChains = {};

async function handleClientMessage(msg, client) {
    const userPhoneNumber = msg.from;
    const message = msg.body;
    const type = msg.type;
    const result = handleRateLimitAndMessageLength(userPhoneNumber, message, type);
  
    if (result === true) {
      return;
    } else if (typeof result === "string") {
      console.log(`0 ${result}`);
      await client.sendMessage(userPhoneNumber, result);
      return;
    } else if (result === false) {
      const control = handleBotControl(message);
  
      if (control.flag) {
        await client.sendMessage(userPhoneNumber, control.msg);
        return;
      }
      
      if (!control.status) {
        console.log("Mensagem ignorada. O bot está inativo!");
        return;
      }
  
      const response = await processMessageInChain(userPhoneNumber, message);
  
      if (isUserInBlacklist(userPhoneNumber) || isUserBlocked(userPhoneNumber)) {
        console.log(`Usuário ${userPhoneNumber} está bloqueado ou na blacklist.`);
        return;
      }
  
      if (response) {
        console.log(`1 ${result}`);
        await client.sendMessage(userPhoneNumber, response);
      }
    }
}

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
        console.log('Resposta ',response.data.resposta)
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

    const resposta = await sendMessageWithToken(msg, userPhoneNumber);

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
    handleClientMessage,
    sendMessageWithToken,
    processMessageInChain,
    handleMessage
};