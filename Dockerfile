FROM node:25-alpine3.21 AS builder
RUN npm install -g nodemon
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:25-alpine3.21
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY .env .
COPY package*.json .
RUN npm install --production
EXPOSE 5001
CMD [ "node", "dist/index.js" ]