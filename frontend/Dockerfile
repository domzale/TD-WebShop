FROM node:lts
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
RUN rm -rf .env
RUN echo "REACT_APP_BACKEND_URL=http://localhost:5433" > .env
RUN npm run build
RUN rm -rf .gitignore node_modules/ public/ src/

EXPOSE 3000
ENTRYPOINT [ "npx", "serve", "build" ]