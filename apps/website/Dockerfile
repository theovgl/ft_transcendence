#Stage n.1: deps
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm install -g pnpm
RUN pnpm i

# Stage n.2: builder
FROM node:lts-alpine as builder

RUN npm install -g pnpm

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY src ./src
COPY types ./types
COPY public ./public

COPY package*.json next.config.js tsconfig*.json ./

RUN pnpm run build

# Stage n.2: production

FROM node:lts-alpine AS run

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig*.js ./

# Start the production build
CMD [ "npm", "run", "start" ]
