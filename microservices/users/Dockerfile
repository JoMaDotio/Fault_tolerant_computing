FROM node:20

COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN npm i

EXPOSE 3000

CMD ["npm", "run", "build"]