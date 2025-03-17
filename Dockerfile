FROM node:18-alpine AS react-builder

WORKDIR /react-app
COPY true-code-task-client/package.json true-code-task-client/package-lock.json ./
RUN npm install
COPY true-code-task-client ./
RUN npm run build

FROM node:18-alpine AS nest-builder
WORKDIR /nest-app
COPY true-code-task-server/package.json true-code-task-server/package-lock.json ./
RUN npm install
COPY true-code-task-server ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=nest-builder /nest-app/dist ./dist
COPY --from=react-builder /react-app/dist ./dist/client
COPY --from=nest-builder /nest-app/node_modules ./node_modules
COPY --from=nest-builder /nest-app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]