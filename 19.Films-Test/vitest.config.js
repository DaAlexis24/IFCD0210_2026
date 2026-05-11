import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ... Specify options here.
    globals: true,
    setupFiles: './src/config/setup-test.ts',
    // opcionalmente
    include: ['**/*.test.ts', '**/*.test.tsx'],
    // opcionalmente, para configurar la cobertura
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/**/entities/*.ts', 'src/**/types/*.ts'],
    },
  },
})
