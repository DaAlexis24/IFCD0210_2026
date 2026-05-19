
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        // ... Specify options here.
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setup-test.ts',
        // opcionalmente
        include: ['**/*.test.ts'],
        // opcionalmente, para configurar la cobertura
        coverage: {
            include: ['src/**/*.ts'],
        //     exclude: [
        //         // Loader de la aplicación
        //         'src/index.ts',
        //         // Tipos y constantes
        //         'src/**/entities/*.ts',
        //         'src/**/types/*.ts',
        //     ],
        },
    },
});
