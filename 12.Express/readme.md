# Servidor Web: Node + Express (MVC API REST + Views)

Info de Express en 11.Express\info\info.express.md

- MVC completo
- API REST + Views
- datos en db.json


Estructura de carpetas final

/public
/src
  /config (env.ts)
  /controllers [new] (notes.controller.ts)
  /data (db.json)
  /entities (note.ts)
  /errors (http-error.ts)
  /middleware (custom.ts, error-handler.ts)
  /router (router.ts)
  /services (repo.ts)
  /types (repo.type.ts)
  /views [new] (home.view.ts...)
    /components
    /types (view.ts)
  app.ts - app.initial.ts
  index.ts - index.initial.ts

Contenidos y desarrollo del proyecto:

- Separación de responsabilidades: server v. app
  - Server
    - eventos: listening, error
  - App: función createApp
    - Cabeceras: app.disable()
- Middleware
  - Cors
  - Morgan
  - añadir cabeceras (Custom)
  - Middleware nativos de Express
    - json()
    - urlencoded()
    - static: elementos estáticos()
- Error Handler
  - clase HttpError
- Rutas y routers (method / url) 
  - Rutas con parámetros
  - Rutas con query string
  - rutas del CRUD de notes
  - probadas con postman
- Controladores
- Capa de datos
  - Entities
  - Repo (el mismo que para el CLI)
- Validaciones: Zod
  - Validación de variables de env
  - Validación de entities
  - Uso de validaciones Zod en la ruta de Create Note (POST)
- Views
  - Elementos estáticos (css, favicon)
  - Vista para el endpoint raíz (home)
    - Lectura del README.md con fs
    - Parseo del contenido con gray-matter
    - Conversión a HTML con marked
  - Vista para el endpoint /api
    - Muestra un json de descripción de las apis disponibles
