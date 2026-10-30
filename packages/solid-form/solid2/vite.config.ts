import { defineConfig, mergeConfig } from 'vitest/config'
import { tanstackViteConfig } from '@tanstack/vite-config'
import solid from '@solidjs/vite-plugin'
import packageJson from './package.json'

// Built into `dist` here and published from `@tanstack/solid-form` as its
// `./solid2` export. The sources use no JSX, so only the tests need the
// Solid 2 compiler.
const config = defineConfig({
  plugins: [solid()],
  test: {
    name: packageJson.name,
    dir: './tests',
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./tests/test-setup.ts'],
    coverage: { enabled: true, provider: 'istanbul', include: ['src/**/*'] },
    typecheck: { enabled: true },
  },
})

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: ['./src/index.ts'],
    srcDir: './src',
  }),
)
