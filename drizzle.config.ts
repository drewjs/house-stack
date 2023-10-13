import 'dotenv/config'
import { type Config } from 'drizzle-kit'

export default {
  out: './drizzle/migrations',
  schema: './drizzle/schema.ts',
  breakpoints: true,
  driver: 'turso',
  dbCredentials: {
    url: process.env.DB_URL as string,
    authToken: process.env.DB_AUTH_TOKEN,
  },
  // print out SQL statements executed with db:push
  verbose: true,
} satisfies Config
