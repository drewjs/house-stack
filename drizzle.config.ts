import 'dotenv/config'

import { type Config } from 'drizzle-kit'

export default {
  out: './migrations',
  schema: './app/db/schema.ts',
  breakpoints: true,
  driver: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  tablesFilter: ['!libsql_wasm_func_table'],
  verbose: true,
} satisfies Config
