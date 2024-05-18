import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { verifyLogin } from '~/models/user.server'
import { safeRedirect } from '~/utils/misc'
import { createUserSession, getUserId } from '~/utils/session.server'
import { validateEmail } from '~/utils/user'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let userId = await getUserId(request)
  if (userId) return redirect('/')
  return json({})
}

export const action = async ({ request }: ActionFunctionArgs) => {
  let formData = await request.formData()
  let email = formData.get('email')
  let password = formData.get('password')
  let redirectTo = safeRedirect(formData.get('redirectTo'), '/')
  let remember = formData.get('remember')

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

  let user = await verifyLogin(email, password)

  if (!user) {
    return json(
      { errors: { email: 'Invalid email or password', password: null } },
      { status: 400 },
    )
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on',
    request,
    userId: user.id,
  })
}

export const meta: MetaFunction = () => [{ title: 'Login' }]

export default function LoginPage() {
  let [searchParams] = useSearchParams()
  let redirectTo = searchParams.get('redirectTo') || '/notes'
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
                autoComplete="current-password"
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
            Log in
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember" name="remember" />
              <label
                htmlFor="remember"
                className="ml-2 block text-gray-900 text-sm"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/join',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
