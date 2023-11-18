FROM node:20

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

RUN npm i

COPY next.config.js ./next.config.js
COPY src ./src
COPY public ./public
COPY next-env.d.ts ./next-env.d.ts

RUN npm run build

CMD ["npm", "run", "start"]