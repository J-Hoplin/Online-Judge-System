FROM node:21-bullseye

COPY . .

RUN yarn install\
npx prisma migrate


CMD [ "start" ]
ENTRYPOINT [ "yarn" ]