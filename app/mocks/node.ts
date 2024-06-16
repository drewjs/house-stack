import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export let server = setupServer(...handlers)

export function init() {
  server.listen({
    onUnhandledRequest(request, print) {
      if (request.url.includes('.sentry.io')) return

      // Print the regular MSW unhandled request warning otherwise.
      print.warning()
    },
  })

  if (process.env.NODE_ENV !== 'test') {
    console.info('🔶 Mock server installed')
  }
}
