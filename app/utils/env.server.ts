import { z } from 'zod'

const schema = z.object({
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
