import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from 'drizzle/schema'

import { invariant } from '~/utils/misc'
import { singleton } from '~/utils/singleton.server'

const client = singleton('db-client', () => {
  invariant(process.env.DB_URL, 'DB_URL is required')

  return createClient({
    url: process.env.DB_URL,
    authToken: process.env.DB_AUTH_TOKEN,
    syncUrl: process.env.DB_SYNC_URL,
  })
})

export const db = singleton('db', () => drizzle(client, { schema }))
