let isActive = false;

function handleBotControl(message) {
    switch (message) {
        case '!start':

            if(isActive){
                return {flag:true, msg:"Bot já está ativo!", status:isActive};
            }

            isActive = true;
            console.log("Bot foi iniciado via comando !start.");
            return {flag:true, msg:"Bot foi iniciado e está ativo!", status:isActive};
        case '!stop':

            if(!isActive){
                return {flag:true, msg:"Bot já está inativo!", status:isActive};
            }

            isActive = false;
            console.log("Bot foi parado via comando !stop.");
            return {flag:true, msg:"Bot foi parado e está inativo!", status:isActive};
        case '!status':
            console.log("O status do bot está send pedido via comando !status.");

            if (isActive){
                return {flag:true, msg:"Bot está ativo!", status:isActive}; 
            }

            return {flag:true, msg:"Bot está inativo!", status:isActive}; 
        default:
            return {flag:false, msg:" ", status:isActive};
    }
}

module.exports = {
    handleBotControl
};