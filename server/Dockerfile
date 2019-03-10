FROM node:latest
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5555
CMD node index.js