FROM node:20
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
RUN npm install -g pm2

EXPOSE 3001

CMD ["pm2", "start", "build/index.js", "--name", "trading-service", "--watch", "--restart-delay", "1000", "--no-daemon"]