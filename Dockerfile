# Use uma imagem base do Node.js
FROM node:21

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instala dependências necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm-dev \
    libasound2 \
    libpangocairo-1.0-0 \
    libxshmfence1 \
    libgtk-3-0 \
    --no-install-recommends

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o contêiner
COPY . .

# Copia as pastas de credenciais para o contêiner
COPY .wwebjs_auth ./.wwebjs_auth
COPY .wwebjs_cache ./.wwebjs_cache

# Expõe a porta (se necessário)
EXPOSE 3000

# Define o comando para rodar a aplicação
CMD ["node", "src/index.js"]