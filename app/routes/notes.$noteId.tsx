import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'

import { deleteNote, getNote } from '~/models/note.server'
import { invariant } from '~/utils/misc'
import { requireUserId } from '~/utils/session.server'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  let userId = await requireUserId(request)
  invariant(params.noteId, 'noteId not found')

  let note = await getNote({ id: +params.noteId, userId })
  if (!note) {
    throw new Response('Not Found', { status: 404 })
  }
  return json({ note })
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  let userId = await requireUserId(request)
  invariant(params.noteId, 'noteId not found')

  await deleteNote({ id: +params.noteId, userId })

  return redirect('/notes')
}

export default function NoteDetailsPage() {
  let data = useLoaderData<typeof loader>()

  return (
    <div>
      <h3 className="font-bold text-2xl">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white focus:bg-blue-400 hover:bg-blue-600"
        >
          Delete
        </button>
      </Form>
    </div>
  )
}

export function ErrorBoundary() {
  let error = useRouteError()

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>
  }

  if (error.status === 404) {
    return <div>Note not found</div>
  }

  return <div>An unexpected error occurred: {error.statusText}</div>
}
