import bcrypt from 'bcryptjs'
import { type InferSelectModel, eq } from 'drizzle-orm'
import { db } from '~/db.server'
import { passwords, users } from 'drizzle/schema'

export type User = InferSelectModel<typeof users>
export type Password = InferSelectModel<typeof passwords>

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
  const hash = bcrypt.hash(password, 10)
  const user = await db.insert(users).values({ email }).returning().get()
  await db.insert(passwords).values({ userId: user.id, hash: await hash })
  return user
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash'],
): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: { password: true },
  })
  if (!user) return null
  if (!bcrypt.compareSync(password, user.password.hash)) return null

  const { password: _, ...sanitizedUser } = user
  return sanitizedUser
}
