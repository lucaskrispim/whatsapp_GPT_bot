require('dotenv').config();

function validateEnvVars() {
    const requiredEnvVars = [
        'MESSAGE_LIMIT',
        'TIME_WINDOW',
        'BLOCK_TIME',
        'MAX_MESSAGE_LENGTH',
        'MAX_VIOLATIONS',
        'MAX_UNSUPPORTED_VIOLATIONS',
        'COMMON_PASSWORD',
        'BASE_URL'
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingVars.length > 0) {
        console.error(`Erro: As seguintes variáveis de ambiente estão faltando: ${missingVars.join(', ')}`);
        process.exit(1);
    }
}

validateEnvVars();

module.exports = {
    MESSAGE_LIMIT: parseInt(process.env.MESSAGE_LIMIT),
    TIME_WINDOW: parseInt(process.env.TIME_WINDOW),
    BLOCK_TIME: parseInt(process.env.BLOCK_TIME),
    MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH),
    MAX_VIOLATIONS: parseInt(process.env.MAX_VIOLATIONS),
    MAX_UNSUPPORTED_VIOLATIONS: parseInt(process.env.MAX_UNSUPPORTED_VIOLATIONS),
    COMMON_PASSWORD: process.env.COMMON_PASSWORD,
    BASE_URL: process.env.BASE_URL
};
