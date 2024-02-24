import 'dotenv/config'

import { createClient } from '@libsql/client/sqlite3'
import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

import { notes, passwords, users } from '~/db/schema'

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

const db = drizzle(client)

async function seed() {
  await migrate(db, { migrationsFolder: 'migrations' })

  let user = await db
    .insert(users)
    .values({ id: 1, email: 'rachel@remix.run' })
    .returning()
    .get()

  let hash = bcrypt.hashSync('racheliscool', 10)
  await db.insert(passwords).values({ hash, userId: user.id })

  await db.insert(notes).values([
    {
      title: 'My first note',
      body: 'This is my first note',
      userId: user.id,
    },
    {
      title: 'My second note',
      body: 'This is my second note',
      userId: user.id,
    },
  ])

  console.log('Database has been seeded. 🌱')
  process.exit(0)
}

seed()
