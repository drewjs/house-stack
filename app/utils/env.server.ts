import 'dotenv/config'
import { z } from 'zod'

let schema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'] as const),
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
})

export function init() {
  let result = schema.safeParse(process.env)
  if (result.success) return

  console.error('Invalid environment variables', result.error.flatten())

  throw new Error('Invalid environment variables')
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

/**
 * Note: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
