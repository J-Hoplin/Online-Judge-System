FROM node:21-bullseye

COPY . .

RUN yarn install

CMD [ "docker:start" ]
ENTRYPOINT [ "yarn" ]