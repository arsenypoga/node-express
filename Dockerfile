FROM alpine:3.4
LABEL authors="IllyaLaifu"
RUN apk add --update nodejs bash git
COPY package.json /www/package.json
RUN cd /www; npm install
COPY . /www
COPY . /www
ENV PORT 3000
EXPOSE 3000

CMD ["npm", "start"]

