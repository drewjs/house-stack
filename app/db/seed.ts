import 'dotenv/config'

import bcrypt from 'bcryptjs'

import { db } from './db.server'
import { notes, passwords, users } from './schema'

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
