const {
    isUserInBlacklist,
    addUserToBlacklist,
    getUserRateLimit,
    updateUserRateLimit
} = require('./state');

const { 
    MESSAGE_LIMIT, 
    TIME_WINDOW, 
    BLOCK_TIME, 
    MAX_MESSAGE_LENGTH, 
    MAX_VIOLATIONS, 
    MAX_UNSUPPORTED_VIOLATIONS 
} = require('../config/env');

function handleRateLimitAndMessageLength(userPhoneNumber, msg, msgType) {
    const currentTime = Date.now();

    if (isUserInBlacklist(userPhoneNumber)) {
        console.log(`Usuário ${userPhoneNumber} está na blacklist.`);
        return true;
    }

    const userRateLimit = getUserRateLimit(userPhoneNumber);

    if (userRateLimit.blockedUntil > currentTime) {
        return true;
    }

    if (msgType !== 'chat') {
        userRateLimit.unsupportedViolations += 1;

        if (userRateLimit.unsupportedViolations >= MAX_UNSUPPORTED_VIOLATIONS) {
            addUserToBlacklist(userPhoneNumber);
            console.log(`Usuário ${userPhoneNumber} foi adicionado à blacklist por enviar mensagens não suportadas.`);
            return true;
        }

        if (!userRateLimit.violationNotified) {
            userRateLimit.violationNotified = true;
            updateUserRateLimit(userPhoneNumber, userRateLimit);
            return `Apenas mensagens de texto são suportadas. Por favor, não envie mídia, vídeos ou áudios.`;
        }

        updateUserRateLimit(userPhoneNumber, userRateLimit);
        return;
    }

    if (msg.length > MAX_MESSAGE_LENGTH) {
        userRateLimit.lengthViolations += 1;

        if (userRateLimit.lengthViolations >= MAX_VIOLATIONS) {
            addUserToBlacklist(userPhoneNumber);
            console.log(`Usuário ${userPhoneNumber} foi adicionado à blacklist por excesso de mensagens longas.`);
            return true;
        }

        if (!userRateLimit.violationNotified) {
            userRateLimit.violationNotified = true;
            updateUserRateLimit(userPhoneNumber, userRateLimit);
            return `Sua mensagem é muito longa. Por favor, reduza o tamanho para menos de ${MAX_MESSAGE_LENGTH} caracteres.`;
        }
    }

    userRateLimit.messages = userRateLimit.messages.filter(timestamp => currentTime - timestamp < TIME_WINDOW);

    if (userRateLimit.messages.length >= MESSAGE_LIMIT) {
        userRateLimit.blockedUntil = currentTime + BLOCK_TIME;
        userRateLimit.violations += 1;

        if (userRateLimit.violations >= MAX_VIOLATIONS) {
            addUserToBlacklist(userPhoneNumber);
            console.log(`Usuário ${userPhoneNumber} foi adicionado à blacklist por excesso de violações.`);
            return true;
        }

        if (!userRateLimit.violationNotified) {
            userRateLimit.violationNotified = true;
            updateUserRateLimit(userPhoneNumber, userRateLimit);
            return 'Você está enviando mensagens muito rápido. Por favor, aguarde um momento antes de enviar novamente.';  
        }
    }

    userRateLimit.violationNotified = false;
    userRateLimit.messages.push(currentTime);
    updateUserRateLimit(userPhoneNumber, userRateLimit);

    return false;
}

module.exports = {
    handleRateLimitAndMessageLength
};