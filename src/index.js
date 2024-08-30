const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleRateLimitAndMessageLength } = require('./services/rateLimit');
const { processMessageInChain } = require('./services/messaging');
const { isUserInBlacklist, isUserBlocked } = require('./services/state');

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

    const result = handleRateLimitAndMessageLength(userPhoneNumber, message, type);

    if (result === true) {
        return;
    } else if (typeof result === "string") {
        client.sendMessage(userPhoneNumber, result);
    } else if (result === false) {
        const response = await processMessageInChain(userPhoneNumber, message);

        if (isUserInBlacklist(userPhoneNumber) || isUserBlocked(userPhoneNumber)) {
            console.log(`Usuário ${userPhoneNumber} está bloqueado ou na blacklist.`);
            return;
        }

        if (response) {
            client.sendMessage(userPhoneNumber, response);
        }
    }
});

client.initialize();
