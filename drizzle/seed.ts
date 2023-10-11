import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { notes, passwords, users } from 'drizzle/schema'
import { invariant } from '~/utils/misc'

invariant(process.env.DATABASE_URL, 'DATABASE_URL missing in environment')

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

const db = drizzle(client)

async function seed() {
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

  console.log(`Database has been seeded. 🌱`)
  process.exit(0)
}

seed()
