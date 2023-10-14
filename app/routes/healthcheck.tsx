import type { LoaderFunctionArgs } from '@remix-run/node'
import { sql } from 'drizzle-orm'

import { db } from '~/db/db.server'
import { users } from '~/db/schema'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

  try {
    let url = new URL('/', `http://${host}`)
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      fetch(url.toString(), { method: 'HEAD' }).then(r => {
        if (!r.ok) return Promise.reject(r)
      }),
    ])
    return new Response('OK')
  } catch (error: unknown) {
    console.log('healthcheck ❌', { error })
    return new Response('ERROR', { status: 500 })
  }
}
