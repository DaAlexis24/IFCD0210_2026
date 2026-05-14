# Front-Films

Proyecto didáctico de desarrollo web centrado en el uso de componentes web creados sin ningún framework. El objetivo es practicar la construcción de interfaces con Web Components y organizar el código con TypeScript. La integración de Vitest se abordará en la siguiente etapa del curso.

## Propósito

Este repositorio forma parte de un curso de desarrollo web y sirve como base para construir una aplicación de películas con sus géneros, reviews y usuarios.

## Funcionalidad prevista

La aplicación está pensada para cubrir estos casos de uso:

- mostrar una lista de películas a todos los usuarios, incluso sin iniciar sesión;
- permitir que los usuarios se registren y accedan con login;
- diferenciar entre los roles de USER, EDITOR y ADMIN;
- permitir que cualquier persona vea el catálogo de películas sin autenticarse;
- permitir que los usuarios logados añadan reviews a las películas;
- permitir que EDITOR y ADMIN añadan, modifiquen y eliminen películas;
- permitir que EDITOR y ADMIN creen géneros y los vinculen a las películas.

Desde la lista de películas, cuando el usuario está logado, podrá acceder a la página de detalle de cada película, donde se mostrarán sus reviews.

En esa pantalla, un usuario podrá:

- ver todos los reviews de la película;
- añadir un review si todavía no ha publicado uno para esa película, con la restricción de un único review por usuario;
- modificar y eliminar únicamente sus propios reviews.

## Tecnología principal

- TypeScript
- Web Components nativos
- Vite como entorno de desarrollo
- Vitest como siguiente etapa del curso (todavía no integrado en esta fase)

## Convenciones de desarrollo

Para mantener el proyecto legible y coherente con el curso, se seguirán estas convenciones:

- TypeScript en modo estricto, para detectar errores de tipado y usos incorrectos desde fases tempranas.
- Indentación de 4 espacios, comillas simples y punto y coma al final de las instrucciones.
- Importaciones explícitas, omitiendo la extensión `.ts` cuando el entorno lo permita.
- Archivos de página con el patrón `*-page.ts`.
- Componentes web con el patrón `*.ts` y su hoja de estilos asociada en `*.css`.
- Código organizado en piezas pequeñas y enfocadas, priorizando la claridad frente a la abstracción excesiva.

## Arquitectura de la aplicación

Desde el punto de vista de arquitectura, la aplicación se organizará en torno a entidades de dominio coherentes con la API que se utilizará:

- `User` para representar a los usuarios y sus roles.
- `Film` para modelar las películas.
- `Genre` para representar los géneros asociados a una película.
- `Review` para gestionar las valoraciones y comentarios de los usuarios.

Todas las interacciones con la API se encapsularán en una única **capa de repositorios** siguiendo el patrón repositorio. Esta capa actuará como punto único de acceso a los datos y aislará al resto de la aplicación de los detalles técnicos de transporte, endpoints y formato de respuesta.

## Organización funcional

La aplicación se apoyará en las siguientes piezas funcionales:

- La lista principal de películas mostrará el catálogo incluso sin autenticación.
- La página de detalle permitirá consultar la información ampliada de cada película.
- La autenticación gestionará el alta y el acceso de usuarios.
- Los roles delimitarán permisos de visualización y edición entre USER, EDITOR y ADMIN.
- Las reviews quedarán ligadas a un usuario y a una película concreta, con control de creación, edición y borrado sobre los propios registros.
- Los géneros se usarán como una capa de clasificación reutilizable para enriquecer el catálogo.

## Configuración del proyecto

La configuración técnica del proyecto se reparte entre varios ficheros clave:

- [tsconfig.json](tsconfig.json) define la compilación de TypeScript con `target` en `ESNext`, módulos `ESNext`, resolución `bundler` y salida desactivada con `noEmit: true`, porque Vite se encarga del bundling final.
- También en [tsconfig.json](tsconfig.json) se activa `strict`, junto con `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` y `noUncheckedSideEffectImports`, para mantener un control alto sobre la calidad del código.
- [eslint.config.js](eslint.config.js) usa `@eslint/js`, `typescript-eslint` y `globals` para aplicar reglas base de JavaScript, reglas estrictas y reglas de estilo para TypeScript, además de declarar los entornos `browser` y `node`.
- La configuración de Prettier se recoge en [package.json](package.json), donde se establece `singleQuote: true` para que el formateo use comillas simples de forma consistente.

## Recursos estáticos y estilos globales

La aplicación mantiene una separación clara entre recursos públicos y estilos globales:

- la carpeta [public/](public/) se reserva para los assets que deben servirse directamente desde el navegador, como iconos, imágenes o el favicon;
- [base.css](base.css) y [index.css](index.css) actúan como las hojas de estilo globales del proyecto;
- en ellas se concentran variables de diseño, reglas de reset, ajustes de tipografía, layout base y estilos comunes reutilizables;
- el resto de estilos se distribuye por componente o por sección, siguiendo la organización del código.

## Validación del proyecto

De momento no hay un script de pruebas automatizadas en `package.json`, así que la validación del trabajo se apoya en estos pasos:

- `npm run build` para comprobar que TypeScript compila correctamente y que Vite puede generar la aplicación.
- `npm run dev` para revisar manualmente la navegación, los componentes web y el comportamiento general en el navegador.
- `npm run preview` para comprobar la versión de producción generada.

Si más adelante se incorpora un flujo de pruebas con Vitest, lo natural será documentar aquí el comando correspondiente y el tipo de tests disponibles.

## Estructura del proyecto

- `src/` contiene la aplicación principal.
- `src/core/components/` agrupa los componentes reutilizables.
- `src/core/router/` centraliza la navegación.
- `src/core/data/` almacena datos estáticos.
- `src/core/entities/` contendrá las entidades de dominio como `User`, `Film`, `Genre` y `Review`.
- `src/core/repositories/` contendrá la capa de repositorios que coordina las operaciones de datos.
- `home/`, `about/` y `films/` contienen las vistas o páginas del proyecto.

## Lectura del código

La estructura anterior debe entenderse como una guía formativa para recorrer el proyecto:

- `components` reunirá elementos reutilizables y autocontenidos.
- `entities` modelará los datos con una forma coherente con la API.
- `repositories` centralizará la obtención y persistencia de información.
- `router` resolverá la navegación entre pantallas.
- Las páginas servirán como punto de composición de la experiencia de usuario.

Esta separación ayuda a trabajar el proyecto por capas y hace más sencilla la evolución posterior de la aplicación.

## Scripts disponibles

- `npm run dev` para iniciar el servidor de desarrollo.
- `npm run build` para compilar y verificar el proyecto.
- `npm run preview` para previsualizar la versión generada.
- `npm run lint` para comprobar el estilo y la calidad del código con ESLint.

## Cómo funciona el router en vanilla

El proyecto implementa un router propio en JavaScript/TypeScript vanilla, sin usar librerías de enrutado.

Su funcionamiento se basa en estos elementos:

- una tabla de rutas que define, para cada entrada, una ruta, una etiqueta y una función de renderizado;
- una función de navegación central que decide qué página se debe pintar;
- uso de la History API del navegador para actualizar la URL sin recargar la página.

Flujo general de navegación:

- al arrancar la aplicación, se inicializa el estado del historial y se resuelve la ruta actual;
- cuando se navega de forma interna, la función de navegación puede insertar una nueva entrada en el historial con `pushState`;
- para evitar renders innecesarios, se compara la URL objetivo con el estado actual del historial;
- se extrae el segmento de ruta activo y se busca la página correspondiente en la tabla de rutas;
- si existe coincidencia, se ejecuta la función de renderizado de esa página.

Integración con navegación del navegador:

- la aplicación escucha el evento `popstate` para reaccionar a los botones atrás y adelante;
- en ese caso, se vuelve a resolver la URL actual, pero sin añadir otra entrada al historial.

Este enfoque permite entender de forma didáctica cómo construir una SPA básica sin framework, separando la responsabilidad del router de la lógica de los componentes y de las páginas.

Conviene tener en cuenta que se trata de un router básico, pensado para aprender el flujo esencial de navegación:

- no implementa rutas anidadas;
- no gestiona de forma avanzada parámetros `query`;
- no gestiona de forma avanzada fragmentos `hash`;
- se centra en resolver páginas principales y en ilustrar el uso de la History API.

## Cómo implementamos los Web Components

La aplicación usa Web Components nativos a través de Custom Elements, sin librerías externas y sin usar Shadow DOM.

Decisiones clave del enfoque actual:

- cada componente se implementa como una clase que extiende de `HTMLElement`;
- el registro del componente se realiza con `customElements.define(...)` solo si antes `customElements.get(...)` confirma que no estaba registrado;
- no se usa `attachShadow(...)`, por lo que no hay encapsulación de estilos en un shadow root;
- no se usa el elemento HTML `<template>` como fuente de marcado;
- el HTML del componente se construye con template strings de JavaScript y se inyecta con `innerHTML`.

Patrón común que seguimos en los componentes:

- un método para preparar el contenido (`setTemplate` o equivalente), donde se genera el marcado dinámico;
- un método para pintar el contenido (`setElement` o equivalente), que asigna ese HTML al elemento;
- una fase de enlace de eventos después del render, para conectar botones, menús e interacciones de usuario.

Nota sobre el componente de menú:

- la implementación actual del menú es deliberadamente didáctica;
- en una versión productiva, la gestión de listeners se movería al ciclo de vida del componente (`connectedCallback`/`disconnectedCallback`) para registrar y limpiar eventos de forma explícita.

Implicaciones formativas de este diseño:

- facilita entender de forma explícita cómo se crea y actualiza el DOM sin abstracciones de framework;
- permite trabajar con CSS global y por componente de forma directa;
- simplifica el arranque del proyecto para centrarse en arquitectura, tipado y flujo de navegación;
- hace visible el coste de re-renderizar con `innerHTML`, lo cual es útil para aprender cuándo conviene optimizar.

Este enfoque es intencionalmente didáctico: primero se domina el funcionamiento base de los Custom Elements y, en una fase posterior del curso, se podrá comparar con variantes que sí usen Shadow DOM y plantillas nativas.

## Cómo organizamos el CSS

La estrategia de estilos combina una base global con estilos específicos por componente, manteniendo un enfoque sencillo y pedagógico.

Capas globales de estilos:

- el CSS más global vive en [base.css](base.css) y [index.css](index.css), que actúan como base común de toda la interfaz;
- en esos ficheros se define buena parte del design system de la app mediante custom properties;
- estas variables incluyen colores, tipografías, escala tipográfica, tamaños y otros tokens reutilizables;
- también se organizan reglas generales de reset, layout y estilos comunes con `@layer`.

CSS por componente:

- cada componente que lo necesita incorpora su propio fichero CSS;
- ese CSS se vincula importándolo desde el propio componente TypeScript, aprovechando el soporte de Vite para imports de estilos;
- este patrón ayuda a mantener juntos el marcado, la lógica y el estilo de cada pieza.

Alcance de estilos sin Shadow DOM:

- como no usamos Shadow DOM, los estilos no tienen encapsulación nativa de scope;
- para reducir colisiones, se aplica anidamiento CSS y selectores contextualizados por componente (por ejemplo, partiendo del tag del custom element);
- así se consigue un “scope práctico” suficiente para el curso, sin perder la transparencia de trabajar sobre el DOM global.

Este planteamiento permite aprender primero los fundamentos del CSS aplicado a Web Components en vanilla, antes de introducir técnicas de encapsulación más avanzadas.

## Notas

El proyecto está pensado como material de aprendizaje, por lo que prioriza claridad, modularidad y ejemplos sencillos sobre abstracciones complejas.
