import type { ActionFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import { createNote } from '~/models/note.server'
import { requireUserId } from '~/utils/session.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  let userId = await requireUserId(request)

  let formData = await request.formData()
  let title = formData.get('title')
  let body = formData.get('body')

  if (typeof title !== 'string' || title.length === 0) {
    return json(
      { errors: { body: null, title: 'Title is required' } },
      { status: 400 },
    )
  }

  if (typeof body !== 'string' || body.length === 0) {
    return json(
      { errors: { body: 'Body is required', title: null } },
      { status: 400 },
    )
  }

  let note = await createNote({ body, title, userId })

  return redirect(`/notes/${note.id}`)
}

export default function NewNotePage() {
  let actionData = useActionData<typeof action>()
  let titleRef = useRef<HTMLInputElement>(null)
  let bodyRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus()
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus()
    }
  }, [actionData])

  return (
    <Form
      method="post"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? 'title-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.title ? (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? 'body-error' : undefined
            }
          />
        </label>
        {actionData?.errors?.body ? (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white focus:bg-blue-400 hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </Form>
  )
}
