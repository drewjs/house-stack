import * as Sentry from '@sentry/remix'

export function init() {
  if (!ENV.SENTRY_DSN) return

  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    tracesSampleRate: 1,
  })
}
