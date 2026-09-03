FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
COPY public ./public
COPY .next ./.next
COPY node_modules ./node_modules
COPY .env ./

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]
