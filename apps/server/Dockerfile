# Stage n.1: local development
FROM node:lts-alpine as dev
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Stage n.2: production build

FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY --from=dev /app/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

# Stage n.3: production
FROM node:lts-alpine as production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Start the production build
CMD [ "node", "dist/main.js" ]
