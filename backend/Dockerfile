FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --build-from-source

COPY . .

EXPOSE 3000

CMD ["node", "app/src/server.js"]