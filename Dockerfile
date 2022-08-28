# base node image
FROM node:16-alpine as base

# Install openssl for Prisma
RUN apk update && apk add bash openssl

FROM base as build

WORKDIR /var/app

ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma:generate && yarn build
RUN npm prune --omit=dev

FROM base AS runtime
ENV NODE_ENV production
WORKDIR /home/node/app

COPY --from=build /var/app/node_modules ./node_modules
COPY --from=build /var/app/build ./build
COPY --from=build /var/app/public ./public
COPY package.json prisma .docker/entrypoint.sh ./

CMD ["sh", "/home/node/app/entrypoint.sh"]