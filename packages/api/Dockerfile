FROM node:9

WORKDIR /opt/app
ADD . /opt/app

# ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_ENV=production

# RUN npm install
RUN yarn
# RUN npm run build
RUN yarn run build

EXPOSE 8080
CMD ["npm", "start"]
