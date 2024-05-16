import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { createUser, getUserByEmail } from '~/models/user.server'
import { safeRedirect } from '~/utils/misc'
import { createUserSession, getUserId } from '~/utils/session.server'
import { validateEmail } from '~/utils/user'

export const action = async ({ request }: ActionFunctionArgs) => {
  let formData = await request.formData()
  let email = formData.get('email')
  let password = formData.get('password')
  let redirectTo = safeRedirect(formData.get('redirectTo'), '/')

  if (!validateEmail(email)) {
    return json(
      { errors: { email: 'Email is invalid', password: null } },
      { status: 400 },
    )
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { email: null, password: 'Password is required' } },
      { status: 400 },
    )
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: 'Password is too short' } },
      { status: 400 },
    )
  }

  let existingUser = await getUserByEmail(email)
  if (existingUser) {
    return json(
      {
        errors: {
          email: 'A user already exists with this email',
          password: null,
        },
      },
      { status: 400 },
    )
  }

  let user = await createUser({ email, password })

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

export const meta: MetaFunction = () => [{ title: 'Sign Up' }]

export default function Join() {
  let [searchParams] = useSearchParams()
  let redirectTo = searchParams.get('redirectTo') ?? undefined
  let actionData = useActionData<typeof action>()
  let emailRef = useRef<HTMLInputElement>(null)
  let passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus()
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus()
    }
  }, [actionData])

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-1">
              <Input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1">
              <Input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button type="submit" className="w-full">
            Create account
          </Button>
          <div className="flex items-center justify-center">
            <div className="text-center text-gray-500 text-sm">
              Already have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/login',
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
