FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 8000

ENV DATABASE_URL=your_database_url_here

CMD ["pnpm", "start"]
