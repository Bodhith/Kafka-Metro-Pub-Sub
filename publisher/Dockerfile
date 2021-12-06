FROM node:17-alpine3.12
RUN npm install -g nodemon
EXPOSE 5000
COPY . /application/
WORKDIR /application/
CMD ["nodemon"]
