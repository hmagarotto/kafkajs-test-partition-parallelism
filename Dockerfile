FROM node:dubnium

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm ci --production && npm cache clean --force

# Copy app
COPY index.js /usr/src/app/index.js

CMD [ "node", "index.js" ]
