# Servidor Web: Node + Express

Info en 11.Express\info\info.express.md


Estructura de carpetas final

/public
/src
  /config (env.ts)
  /data (db.json)
  /entities (note.ts)
  /errors (http-error.ts)
  /middleware (custom.ts, error-handler.ts)
  /router (router.ts)
  /services (repo.ts)
  /types (repo.type.ts)
  app.ts - app.initial.ts
  index.ts - index.initial.ts

Contenidos y desarrollo del proyecto:

- Separación de responsabilidades: server v. app
- Rutas (method / url) y controladores
- Custom Middleware 
  - logger (después se elimina al usar Morgan)  
  - Cabeceras: app.disable()
  - añadir cabeceras
- Middleware de terceros
  - Cors
  - Morgan
- Middleware nativos de Express
  - json()
  - urlencoded()
  - static: elementos estáticos()
- Error Handler
  - clase HttpError
- Mejoras del server
  - Listen info
  - eventos
- Mejoras de App
- Rutas y routers
  - Rutas con parámetros
  - Rutas con query string
  - rutas del CRUD de notes
  - probadas con postman
- Capa de datos
  - Entities
  - Repo (el mismo que para el CLI)
- Validaciones: Zod
  - Validación de variables de env
  - Validación de entities
  - Uso de validaciones Zod en la ruta de Create Note (POST)
