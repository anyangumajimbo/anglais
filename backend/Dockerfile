FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["pnpm", "dev"]
