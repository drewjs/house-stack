import { sentryVitePlugin } from '@sentry/vite-plugin'
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          disable: process.env.NODE_ENV !== 'production',
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          release: {
            name: process.env.COMMIT_SHA,
            setCommits: {
              auto: true,
            },
          },
          sourcemaps: {
            filesToDeleteAfterUpload: ['./build/**/*.map'],
          },
        })
      : null,
  ],
  build: {
    target: 'ES2022',
    sourcemap: !!process.env.SENTRY_AUTH_TOKEN,
  },
})
