import { and, desc, eq } from 'drizzle-orm'

import { db } from '~/db/db.server'
import { notes, type Note } from '~/db/schema'

export type { Note }

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
