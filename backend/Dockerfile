FROM node:lts
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN rm -rf .env
RUN echo "IS_LOCAL_MODE=false" > .env
RUN rm -rf .gitignore

EXPOSE 8080
ENTRYPOINT [ "node", "./src/server.js" ]