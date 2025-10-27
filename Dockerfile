# Use official node image
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files and install production deps
COPY package.json ./
RUN npm install --production

# Copy app sources
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
