import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

import { db } from '~/db/db.server'
import { passwords, users, type Password, type User } from '~/db/schema'

export type { User }

export async function getUserById(id: User['id']): Promise<User | undefined> {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

export async function getUserByEmail(
  email: User['email'],
): Promise<User | undefined> {
  return db.query.users.findFirst({ where: eq(users.email, email) })
}

export async function createUser({
  email,
  password,
}: {
  email: User['email']
  password: string
}): Promise<User> {
  let hash = bcrypt.hash(password, 10)
  let user = await db.insert(users).values({ email }).returning().get()
  await db.insert(passwords).values({ userId: user.id, hash: await hash })
  return user
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash'],
): Promise<User | null> {
  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { password: true },
  })
  if (!user) return null
  if (!bcrypt.compareSync(password, user.password.hash)) return null

  let { password: _, ...sanitizedUser } = user
  return sanitizedUser
}
