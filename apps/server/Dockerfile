# Stage n.1: local development
FROM node:lts-alpine as dev

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN pnpm install

COPY src/ src/
COPY prisma/ prisma/
COPY types/ types/

RUN pnpm run prisma:generate

RUN pnpm run build

# Stage n.2: production

FROM node:lts-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN pnpm install -P

ENV NODE_ENV production

COPY --from=dev /app/dist ./dist/

# Start the production build
CMD [ "node", "dist/main.js" ]