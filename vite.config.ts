import { unstable_vitePlugin as remix } from '@remix-run/dev'
import morgan from 'morgan'
import { type ViteDevServer } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    morganPlugin(),
    remix({
      ignoredRouteFiles: ['**/.*', '**/*.test.{ts,tsx}'],
      serverModuleFormat: 'esm',
    }),
    tsconfigPaths(),
  ],
  build: {
    target: 'ES2022',
  },
})

function morganPlugin() {
  return {
    name: 'morgan-plugin',
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(morgan('tiny'))
      }
    },
  }
}
