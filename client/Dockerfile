FROM node:latest

RUN mkdir -p /app
WORKDIR /app
COPY . .

RUN npm install
RUN npm install -g http-server
RUN npm install -g browserify
RUN browserify app.js > bundle.js

EXPOSE 8080
CMD http-server .