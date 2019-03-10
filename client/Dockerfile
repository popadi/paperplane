FROM node:latest
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g http-server

EXPOSE 8888
CMD ["http-server", "-p 8000 ."]