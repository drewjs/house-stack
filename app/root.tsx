import { json, type LoaderFunctionArgs } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { withSentry } from '@sentry/remix'

import { GeneralErrorBoundary } from '~/components/error-boundary'
import { getUser } from '~/utils/session.server'
import { getEnv } from '~/utils/env.server'
import '~/styles/tailwind.css'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ env: getEnv(), user: await getUser(request) })
}

function Document({
  children,
  env = {},
}: {
  children: React.ReactNode
  env?: Record<string, string>
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: setup client env
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function App() {
  let data = useLoaderData<typeof loader>()
  return (
    <Document env={data.env}>
      <Outlet />
    </Document>
  )
}

export default withSentry(App)

export function ErrorBoundary() {
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  )
}
