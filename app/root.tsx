import { json, type LoaderFunctionArgs } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'

import { getUser } from '~/utils/session.server'
import { getErrorMessage } from './utils/misc'
import '~/styles/tailwind.css'
import { getEnv } from './utils/env.server'
import { GeneralErrorBoundary } from './components/error-boundary'

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

export default function App() {
  //let data = useLoaderData<typeof loader>()

  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary() {
  return (
    <Document>
      <GeneralErrorBoundary />
    </Document>
  )
}
//export function ErrorBoundary() {
//  const error = useRouteError()
//
//  if (isRouteErrorResponse(error)) {
//    return (
//      <>
//        <h1>
//          {error.status} {error.statusText}
//        </h1>
//        <p>{error.data}</p>
//      </>
//    )
//  }
//
//  return (
//    <>
//      <h1>Error!</h1>
//      <p>{getErrorMessage(error)}</p>
//    </>
//  )
//}
