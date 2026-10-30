// `@testing-library/jest-dom/vitest` augments the workspace's Vitest, while
// this package runs its own Vitest (on Vite 8 for the Solid 2 plugin).
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<any, T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<
    any,
    any
  > {}
}
