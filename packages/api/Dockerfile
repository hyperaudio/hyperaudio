FROM node:9-alpine

WORKDIR /opt/app
ADD . /opt/app

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_ENV=production

RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]
