FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
COPY node_modules ./node_modules
COPY public ./public
COPY .next ./.next

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
