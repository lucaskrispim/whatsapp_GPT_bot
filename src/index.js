const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleRateLimitAndMessageLength } = require('./services/rateLimit');
const { processMessageInChain } = require('./services/messaging');
const { isUserInBlacklist, isUserBlocked } = require('./services/state');
const { handleBotControl, getActiveFlag } = require('./services/control')
const axios = require('axios');
const express = require('express');
const app = express();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Sessão autenticada!');
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
});

client.on('message', async msg => {
    let blocked;
    const userPhoneNumber = msg.from;
    const message = msg.body;
    const type = msg.type;

    const isControlCommand = handleBotControl(message, userPhoneNumber);
    if (isControlCommand) return;

    if (!getActiveFlag()) {
        console.log("Bot está desligado. Mensagem ignorada.");
        return;
    }

    const result = handleRateLimitAndMessageLength(userPhoneNumber, message, type);

    if (result === true) {
        return;
    } else if (typeof result === "string") {
        console.log(`0 ${result}`)
        client.sendMessage(userPhoneNumber, result);
    } else if (result === false) {
        const response = await processMessageInChain(userPhoneNumber, message);

        if (isUserInBlacklist(userPhoneNumber) || isUserBlocked(userPhoneNumber)) {
            console.log(`Usuário ${userPhoneNumber} está bloqueado ou na blacklist.`);
            return;
        }

        if (response) {
            console.log(`1 ${result}`)
            client.sendMessage(userPhoneNumber, response);
        }
    }
});

client.initialize();

app.get('/ping', (req, res) => {
    res.status(200).json({ "Ping": "Pong" });
    console.log("Recebido ping de keep-alive.");
});

function keepAlive() {
    setInterval(() => {
 
        const { BASE_URL } = require('./config/env');

        axios.get(`${BASE_URL}/ping`)
            .then(() => console.log("Ping enviado para manter o contêiner ativo."))
            .catch((err) => console.error("Erro ao enviar ping:"));
    }, 5 * 60 * 1000);
}

app.listen(3000, () => {
    console.log('Servidor HTTP escutando na porta 3000');
    keepAlive();
});
