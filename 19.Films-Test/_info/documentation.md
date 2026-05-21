# Documentación

## Swagger UI

Una de las formas estandarizadas de documentar una API REST es a través de OpenAPI, también conocido como [Swagger](https://swagger.io/).

En concreto, [Swagger UI](https://swagger.io/tools/swagger-ui/) es una herramienta que genera una interfaz gráfica interactiva a partir de un archivo de especificación OpenAPI. Esto permite a los desarrolladores y usuarios explorar y probar la API de manera visual.

En Express, puedes usar el paquete `swagger-ui-express` para integrar Swagger UI en tu aplicación. Esto te permitirá servir la documentación de tu API directamente desde tu servidor Express.

La documentación de la API se define en un archivo YAML o JSON que sigue el formato OpenAPI. Este archivo describe los endpoints, los métodos HTTP, los parámetros, las respuestas y otros detalles de tu API. 

## JSDOC para Swagger

Sin embargo, la librería `swagger-jsdoc` permite utilizar un formato de documentación más sencillo, basado en comentarios JSDoc en el código de tus rutas. Esto puede ser más fácil de mantener y sincronizar con tu código, ya que la documentación se genera automáticamente a partir de los comentarios.

El formato JSDOC es una forma genérica de escribir documentación de cualquier aplicación JS  directamente en el código fuente utilizando comentarios especiales. Veamos un ejemplo sencillo de JSDOC fuera del contexto concreto de las APIs

```ts
/**
 * Suma dos números.
 * @param {number} a - El primer número.
 * @param {number} b - El segundo número.
 * @returns {number} La suma de a y b.
 */
function sumar(a, b) {
  return a + b;
}
```

## Swagger UI junto con JSDOC

En el contexto de Swagger, puedes usar JSDOC para describir tus endpoints y generar automáticamente la documentación OpenAPI.

Pra ello necesitamos instalar 2 paquetes y sus tipos:

```shell
npm i swagger-ui-express swagger-jsdoc
npm i -D @types/swagger-ui-express @types/swagger-jsdoc
```

Seguidamente, puedes configurar Swagger UI en tu aplicación Express. Aquí tienes un ejemplo básico de cómo hacerlo:

```ts

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();  

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mi API',
    version: '1.0.0',
    description: 'Documentación de mi API',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Ruta a tus archivos de rutas con JSDOC
};
const swaggerDocs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
```

- definimos una ruta (e.g. `/api-docs`) donde se servirá la documentación generada por Swagger UI.
- la asociamos con un interceptor creado pos swaggerUI.serve, que se encarga de servir como web los archivos estáticos necesarios para la interfaz de Swagger UI
- añadimos el controller de lña ruta, que es el resultado de `swaggerUI.setup(swaggerSpec)`, que genera la interfaz de Swagger UI a partir de la documentación recibida como parámetro del setup, a la que nos refeerimos como `swaggerSpec`.

Para crear `swaggerSpec` utilizaremos un módulo independiente, e.g. `config/swagger.ts`, donde usamos `swagger-jsdoc`, que es una herramienta que genera la documentación OpenAPI a partir de los comentarios JSDOC en el código de tus rutas. Para ello, le pasamos un objeto de configuración con la definición básica de la API y la ruta a los archivos donde se encuentran los comentarios JSDOC.

```ts
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Films API',
            version: '1.0.0',
            description: 'Express API for managing films and users',
        }
    },
    apis: ['./src/**/router/*.ts'] // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
```
