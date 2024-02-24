import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string(),
})

schema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}
