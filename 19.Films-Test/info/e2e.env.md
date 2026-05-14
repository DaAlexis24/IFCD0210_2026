---
title: Testing environment for e2e testing 
---

## Testing

### Estructura

1. Crea la base de datos de test en PostgreSQL.

```shell
CREATE DATABASE animals_test_db;
```

También puedes hacer:

```shell
createdb animals_test_db
```

2. Crea un archivo .env.test en la raíz del proyecto:

```.env
DATABASE_URL="postgresql://postgres:Curso_@2026@localhost:5432/animals_test_db?schema=public"
NODE_ENV=test
PORT=3301
PROJECT_NAME="14_Prisma_Test"
DEBUG="14_Prisma_Test*"
```

3. Crea prisma.config.test.ts:

```ts prisma.config.test.ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --env-file=.env.test ./src/config/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
```

4. Mantén el mismo schema.prisma.

Así reutilizas exactamente las mismas migraciones y el mismo modelo que en desarrollo.

### Preparación de la DB de test

5. Aplica migraciones sobre la base de test:

```shell
npx prisma migrate deploy --config prisma.config.test.ts
```

6. Poblala con seed:

```shell
npx prisma db seed --config prisma.config.test.ts
```

7. Si quieres resetearla entera antes de cada suite o antes de correr tests:

```shell
npx prisma migrate reset --config prisma.config.test.ts --force
npx prisma db seed --config prisma.config.test.ts
```

Esa doble llamada es mi recomendación práctica para Prisma 7: db seed explícito, aunque parte de la documentación de migrate reset todavía menciona seeds automáticos. Prefiero el flujo explícito para que no dependa de matices de versión.

#### Scripts útiles

En package.json podrías dejar algo así:

```json
{
  "scripts": {
    "test:db:migrate": "npx prisma migrate deploy --config prisma.config.test.ts",
    "test:db:seed": "npx prisma db seed --config prisma.config.test.ts",
    "test:db:reset": "npx prisma migrate reset --config prisma.config.test.ts --force",
    "test:db:prepare": "npm run test:db:reset && npm run test:db:seed"
  }
}
```

#### Uso en los tests

Si tus tests usan Prisma directamente, asegúrate de arrancarlos con .env.test, por ejemplo:

```json
{
  "scripts": {
    "test": "node --env-file=.env.test --test"
  }
}
```

Así el cliente Prisma de runtime también apuntará a animals_test_db y no a la base de desarrollo.

#### Resumen

- 1 DB para desarrollo: animals_db
- 1 DB para tests: animals_test_db
- mismo schema.prisma
- mismas migraciones
- seed separado por config de test
- tests arrancados con .env.test

