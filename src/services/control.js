
let isActive = false;

function handleBotControl(message, userPhoneNumber) {
    switch (message) {
        case '!start':
            isActive = true;
            client.sendMessage(userPhoneNumber, "Bot foi iniciado e está ativo!");
            console.log("Bot foi iniciado via comando !start.");
            return true;
        case '!stop':
            isActive = false;
            client.sendMessage(userPhoneNumber, "Bot foi parado e está inativo!");
            console.log("Bot foi parado via comando !stop.");
            return true;
        default:
            return false;
    }
}

function getActiveFlag(){
    return isActive;
}

module.exports = {
    handleBotControl,
    getActiveFlag
};