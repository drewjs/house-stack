import { createCookieSessionStorage, redirect } from '@remix-run/node'

import { getUserById, type User } from '~/models/user.server'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
})

const USER_SESSION_KEY = 'userId'

export async function getSession(request: Request) {
  let cookie = request.headers.get('Cookie')
  return sessionStorage.getSession(cookie)
}

export async function getUserId(
  request: Request,
): Promise<User['id'] | undefined> {
  let session = await getSession(request)
  let userId = session.get(USER_SESSION_KEY)
  return userId
}

export async function getUser(request: Request) {
  let userId = await getUserId(request)
  if (userId === undefined) return null

  let user = await getUserById(userId)
  if (user) return user

  throw await logout(request)
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  let userId = await getUserId(request)
  if (!userId) {
    let searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

export async function requireUser(request: Request) {
  let userId = await requireUserId(request)

  let user = await getUserById(userId)
  if (user) return user

  throw await logout(request)
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request
  userId: User['id']
  remember: boolean
  redirectTo: string
}) {
  let session = await getSession(request)
  session.set(USER_SESSION_KEY, userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  })
}

export async function logout(request: Request) {
  let session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}
