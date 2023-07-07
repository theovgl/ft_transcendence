#!/bin/sh
npm ci

chmod +x /app/node_modules/prisma/build/xdg-open

exec "$@"