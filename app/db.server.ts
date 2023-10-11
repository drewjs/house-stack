import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from 'drizzle/schema'

import { invariant } from '~/utils/misc'
import { singleton } from '~/utils/singleton.server'

const client = singleton('db-client', () => {
  invariant(process.env.DATABASE_URL, 'DATABASE_URL is required')

  return createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  })
})

export const db = singleton('db', () => drizzle(client, { schema }))
