FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps


COPY . .

RUN npm run build

FROM node:20

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5175

CMD ["serve", "-s", "dist", "-l", "5175"]
