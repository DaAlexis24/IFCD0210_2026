import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // ... Specify options here.
        globals: true,
        setupFiles: './src/config/setup-test.ts',
        // opcionalmente
        include: ['**/*.spec.ts'],
        // opcionalmente, para configurar la cobertura
        // coverage: {
        //     include: ['src/**/*.ts'],
        //     exclude: [
        //         // Loader de la aplicación
        //         'src/index.ts',
        //         // Tipos y constantes
        //         'src/**/entities/*.ts',
        //         'src/**/types/*.ts',
        //         'src/**/basic-errors.ts',
        //         // DB Tools y rutas: test e2e
        //         'src/config/db*.ts',
        //         'src/**/router/*.ts'
        //     ],
        //},
    },
});
