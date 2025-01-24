const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// const { handleRateLimitAndMessageLength } = require('./services/rateLimit');
const { handleClientMessage } = require('./services/messaging');
// const { isUserInBlacklist, isUserBlocked } = require('./services/state');
// const { handleBotControl } = require('./services/control')
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
    await handleClientMessage(msg, client);
});

client.initialize();

app.get('/ping', (req, res) => {
    console.log("Recebido ping de keep-alive.");
    res.status(200).json({ "Ping": "Pong" });
    
});

function keepAlive() {
    setInterval(() => {
 
        const { BASE_URL } = require('./config/env');

        axios.get(`${BASE_URL}/ping`)
            .then(() => console.log("Ping enviado para manter o contêiner ativo."))
            .catch((err) => console.error("Erro ao enviar ping:"));
    }, 1 * 60 * 1000);
}

app.listen(3000, () => {
    console.log('Servidor HTTP escutando na porta 3000');
});
