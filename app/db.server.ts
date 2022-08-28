import { PrismaClient } from '@prisma/client'

// eslint-disable-next-line import/no-mutable-exports
let prisma: PrismaClient

declare global {
  let __db__: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === 'production') {
  prisma = getClient()
} else {
  // @ts-ignore
  if (!global.__db__) {
    // @ts-ignore
    global.__db__ = getClient()
  }
  // @ts-ignore
  prisma = global.__db__
}

function getClient() {
  // eslint-disable-next-line no-console
  console.log(`🔌 setting up prisma client`)
  const client = new PrismaClient()

  client.$connect()

  return client
}

export { prisma }
