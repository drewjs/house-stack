import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import * as schema from '~/db/schema'
import { invariant } from '~/utils/misc'
import { singleton } from '~/utils/singleton.server'

export const client = singleton('db-client', () => {
  invariant(process.env.DATABASE_URL, 'DATABASE_URL is required')

  return createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  })
})

export const db = singleton('db', () => drizzle(client, { schema }))

await migrate(db, { migrationsFolder: 'migrations' })
