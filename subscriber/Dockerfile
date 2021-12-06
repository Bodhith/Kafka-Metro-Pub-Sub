FROM node:17-alpine3.12
RUN npm install -g nodemon
EXPOSE 5000
WORKDIR /application/
ENTRYPOINT [ "nodemon", "--legacy-watch", "--inspect=0.0.0.0", "app.js" ]
