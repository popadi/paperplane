FROM node:latest
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8888
CMD ["npm", "start"]