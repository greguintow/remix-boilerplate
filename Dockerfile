# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json yarn.lock ./
RUN yarn install --frozen-yarnlock

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules ./node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules ./node_modules

ADD prisma .
RUN yarn prisma:generate

ADD . .
RUN yarn build

# Run migrations
ARG DATABASE_URL
RUN yarn db:deploy

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules ./node_modules
COPY --from=build /myapp/node_modules/.prisma ./node_modules/.prisma

COPY --from=build /myapp/build ./build
COPY --from=build /myapp/public ./public
ADD . .

CMD ["yarn", "start"]