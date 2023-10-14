import { cssBundleHref } from '@remix-run/css-bundle'
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import globalStyles from '~/styles/global.css'

import { getUser } from './utils/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) })
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
