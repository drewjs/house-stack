import { type InferSelectModel, and, desc, eq } from 'drizzle-orm'
import { notes } from 'drizzle/schema'

import { db } from '~/db.server'

export type Note = InferSelectModel<typeof notes>

export function getNoteListItems({
  userId,
}: {
  userId: Note['userId']
}): Promise<Note[]> {
  return db.query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: [desc(notes.updatedAt)],
  })
}

export function getNote({
  id,
  userId,
}: Pick<Note, 'id' | 'userId'>): Promise<Note | undefined> {
  return db.query.notes.findFirst({
    where: and(eq(notes.id, id), eq(notes.userId, userId)),
  })
}

export async function deleteNote({
  id,
  userId,
}: Pick<Note, 'id' | 'userId'>): Promise<{ id: Note['id'] } | undefined> {
  return db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .returning({ id: notes.id })
    .get()
}

export function createNote(
  data: Pick<Note, 'body' | 'title' | 'userId'>,
): Promise<Note> {
  return db.insert(notes).values(data).returning().get()
}
