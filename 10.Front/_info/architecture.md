# Arquitectura y comunicación entre Components

## ToDo List Como Ejemplo De Arquitectura Con Web Components

En esta iteración del proyecto hemos añadido una feature nueva, `ToDo List`, usándola como excusa didáctica para trabajar varios conceptos importantes del curso:

- como crear una funcionalidad nueva con Custom Elements nativos;
- como integrar una pagina nueva en un router vanilla;
- como separar lógica y presentación sin usar frameworks;
- como comunicar Web Components entre si mediante eventos personalizados;
- como persistir estado en `localStorage` sin acoplar la interfaz a la fuente de datos;
- como testear componentes y repositorios con Vitest y Testing Library.

La idea importante aquí no es solo "hacer una lista de tareas", sino utilizar una feature sencilla para practicar una arquitectura escalable dentro de una SPA basada en Web Components.

## Objetivo Didáctico

La `ToDo List` se ha planteado como una funcionalidad independiente del dominio principal de películas. Eso permite trabajar patrones de diseño de frontend sin mezclar todavía reglas complejas de negocio.

Desde el punto de vista del curso, esta feature nos permite practicar:

- composición de componentes web pequeños;
- encapsulación de responsabilidades;
- flujo de datos descendente;
- flujo de eventos ascendente;
- uso del ciclo de vida `connectedCallback` y `disconnectedCallback`;
- renderizado con `innerHTML` y posterior hidratación de comportamiento;
- separación entre capa de vista, capa de estado y capa de acceso a datos.

## Estructura General De La Feature

La implementación ha quedado repartida en varios archivos:

```text
src/
  todo/
    todo-page.ts
    components/
      todo-container/
        todo-container.ts
        todo-container.css
      todo-add/
        todo-add.ts
        todo-add.css
      todo-list/
        todo-list.ts
        todo-list.css
      todo-item/
        todo-item.ts
        todo-item.css
  core/
    entities/
      todo.entity.ts
    repositories/
      todos-repository.ts
      todos-repository.test.ts
```

Esta distribución refuerza una idea muy importante en el curso: los componentes visuales viven cerca de su propia lógica y estilos, mientras que los modelos y repositorios viven en una capa común reutilizable.

## Integración En La Aplicación

La nueva feature se integra en la SPA a traves del router.

- En `src/core/router/router.ts` se añade la ruta `/todo`.
- El `label` es `Tareas`, de modo que la opción aparece también en el menu, porque el menu recibe las rutas como entrada.
- La pagina que se renderiza es `TodoPage.register`.

Esto es interesante porque muestra que, en una SPA vanilla, una nueva feature no necesita "magia" del framework: basta con registrar un nuevo Custom Element y conectarlo al flujo de navegación.

## La Pagina Como Punto De Entrada Mínimo

`src/todo/todo-page.ts` representa la pagina `ToDo`, pero deliberadamente se ha mantenido muy simple.

Su papel es:

- registrarse como Custom Element;
- asegurarse de que el contenedor de la feature este registrado;
- vaciar el elemento `<main>`;
- montar una instancia nueva de `TodoPage`;
- renderizar el titulo y el componente `<app-todo-container>`.

Esto responde a una decision arquitectónica importante: la pagina no debe convertirse en un componente gigante con toda la lógica dentro. Su responsabilidad es solo actuar como puerta de entrada de la pantalla.

En términos didácticos, esto ensena a no confundir:

- pagina: punto de composición dentro de la navegación;
- contenedor: componente que gobierna el estado;
- presentadores: componentes que muestran datos y emiten eventos.

## Patron Contenedor / Presentadores

La feature se ha organizado con el patron contenedor/presentadores.

### Contenedor

El contenedor es `src/todo/components/todo-container/todo-container.ts`.

Su responsabilidad es:

- mantener el estado de la colección de tareas en `#todos`;
- comunicarse con el repositorio;
- escuchar eventos emitidos por los hijos;
- decidir cuando volver a sincronizar la interfaz;
- calcular information derivada, como el numero de tareas pendientes.

Es decir, `TodoContainer` es el cerebro de la feature.

### Presentadores

Los presentadores son:

- `TodoAdd`: formulario para crear una nueva tarea;
- `TodoList`: componente que muestra la colección;
- `TodoItem`: componente que representa una tarea individual.

Estos componentes no conocen `localStorage`, no llaman a repositorios y no deciden la política de estado global. Solo:

- reciben datos;
- renderizan interfaz;
- notifican acciones del usuario mediante `CustomEvent`.

Esta separation es muy valiosa en el curso porque muestra como aproximarnos a una arquitectura de componentes mantenible sin necesidad de React, Vue o Angular.

## Modelo De Datos Y Validación

El modelo vive en `src/core/entities/todo.entity.ts`.

Se ha definido un esquema `zod` llamado `TodoModelSchema` con estas propiedades:

- `id: string`
- `title: string`
- `completed: boolean`
- `createdAt: string`

Esto tiene varias ventajas didácticas:

- el shape de los datos queda centralizado;
- los componentes y repositorios trabajan contra un tipo común;
- se valida que las tareas tengan una forma correcta antes de usarlas.

No solo se genera el tipo TypeScript `Todo`, sino que también se puede validar información en runtime. Esta combinación es especialmente útil cuando los datos vienen de almacenamiento local o de una API.

## Capa De Persistencia: Repositorio

El acceso a datos se resuelve en `src/core/repositories/todos-repository.ts`.

Aunque la fuente real es `localStorage`, se ha creado un repositorio especifico porque queremos mantener la misma idea arquitectónica ya usada en la parte de películas: la UI no debería depender del detalle técnico de donde se guardan los datos.

Los métodos principales del repositorio son:

- `getAll()`
- `create(title)`
- `toggle(id)`
- `remove(id)`

Aspectos didácticos de esta decision:

- la interfaz queda preparada para cambiar `localStorage` por una API en el futuro;
- el contenedor no tiene que saber como se serializan ni se guardan los datos;
- el manejo de errores y la validación pueden centralizarse aquí.

También es importante que el repositorio siga siendo `async`, aunque internamente use una API síncrona como `localStorage`. Esto unifica el contrato de acceso a datos y evita que luego haya que reescribir los componentes si se sustituye por llamadas HTTP reales.

## Ciclo De Vida Del Contenedor

`TodoContainer` usa muy bien el ciclo de vida de un Custom Element.

En `connectedCallback()` hace tres cosas:

- renderiza el esqueleto inicial;
- registra los listeners de eventos;
- carga las tareas existentes desde el repositorio.

En `disconnectedCallback()` limpia los listeners.

Esto es muy importante dentro del curso porque ayuda a entender que un Web Component no es solo HTML personalizado. También es una unidad de comportamiento que tiene momentos de entrada y salida del DOM, y esos momentos deben aprovecharse para montar y desmontar recursos.

## Flujo De Datos Descendente

El flujo de datos se ha planteado de arriba hacia abajo:

1. `TodoContainer` obtiene la colección de tareas.
2. Guarda esa colección en su propiedad privada `#todos`.
3. Llama a `#syncList()`.
4. `#syncList()` localiza el componente `TodoList`.
5. El contenedor asigna `listElement.todos = this.#todos`.
6. `TodoList` re-renderiza su contenido.

Este flujo es importante porque evita acoplamientos innecesarios. La lista no se conecta sola al repositorio. Es el contenedor quien decide que datos recibe cada parte de la interfaz.

## Flujo De Eventos Ascendente

El movimiento inverso, desde la UI hacia la lógica, se resuelve con eventos personalizados.

### Evento De Alta

`TodoAdd` emite:

- `todo-add`

Su `detail` contiene:

- `title`

El evento se lanza con:

- `bubbles: true`
- `composed: true`

Esto permite que el evento ascienda por el DOM y sea capturado por `TodoContainer`.

### Evento De Cambio

`TodoItem` emite:

- `todo-toggle`
- `todo-remove`

En ambos casos el `detail` contiene:

- `id`

La idea didáctica aquí es clave: los componentes hijos no llaman métodos del padre directamente. Se limitan a anunciar una acción. El contenedor decide que hacer con esa acción.

Este enfoque es muy compatible con el modelo mental de la web nativa:

- el DOM como árbol de nodos;
- los eventos como mecanismo de comunicación;
- los Custom Elements como nodos especializados dentro de ese árbol.

## Componente TodoAdd

`TodoAdd` es un componente de formulario muy pequeño, pero contiene varias buenas practicas.

- Renderiza un `<form>` semántico.
- Escucha el evento `submit`.
- Obtiene los datos con `FormData`.
- Hace `trim()` del titulo.
- Si el valor esta vació, no emite nada.
- Si el valor es valido, emite `todo-add`.
- Después resetea el formulario y devuelve el foco al input.

Didácticamente, este componente sirve para recordar que un Web Component puede apoyarse en APIs del navegador totalmente nativas sin necesidad de abstracciones externas.

## Componente TodoList

`TodoList` se encarga de representar la colección.

Cuando recibe una colección nueva:

- valida cada elemento con `TodoModelSchema.parse`;
- guarda el resultado en `#todos`;
- llama a `#render()`.

En el render hay dos escenarios:

- si no hay tareas, muestra un mensaje vacío;
- si hay tareas, crea el contenedor visual de la lista y después hidrata items.

La hidratación es un concepto importante en este contexto. Primero se genera una estructura base con `innerHTML`, y después se crean las instancias de los elementos mas pequeños.

En la version actual, `TodoList` construye objetos `TodoItem` programáticamente y les pasa el `todo` al crearlos. Esto es pedagógicamente interesante porque deja ver dos formas validas de trabajar con Web Components:

- usar marcado declarativo con tags ya escritos en el HTML;
- crear componentes por código con `new` y `appendChild`.

Ambos enfoques son útiles en vanilla, y este ejercicio permite comparar sus trade-offs.

## Componente TodoItem

`TodoItem` representa una tarea concreta.

Su responsabilidad es:

- mostrar el checkbox;
- mostrar el texto de la tarea;
- mostrar el botón de borrado;
- reflejar visualmente si la tarea esta completada;
- emitir eventos cuando el usuario interactúa.

Aspectos importantes:

- valida el dato recibido con `TodoModelSchema.parse`;
- usa `change` para detectar cambios del checkbox;
- usa `click` para detectar la pulsación del botón;
- no modifica por si mismo la fuente de datos.

Esta ultima idea es esencial. Aunque el checkbox cambia en la interfaz, el estado verdadero no vive dentro de `TodoItem`. Vive en el contenedor y en el repositorio.

## Sincronización De Estado

El patron de trabajo de esta feature es:

1. el usuario interactúa con un presentador;
2. el presentador emite un evento;
3. el contenedor escucha el evento;
4. el contenedor llama al repositorio;
5. el repositorio devuelve una colección actualizada;
6. el contenedor reemplaza `#todos`;
7. el contenedor vuelve a sincronizar la vista.

Esto refleja una idea muy buena para ensenar arquitectura frontend: no actualizar el estado "a trozos" desde muchos sitios, sino centralizar la decision de actualización.

## Semántica Y Accesibilidad

Aunque la feature es sencilla, incluye detalles semánticos relevantes:

- uso de `<form>` para la entrada de datos;
- `label` asociado al `input`;
- `button` con `type="submit"` y `type="button"` según corresponda;
- `aria-label` para mejorar la identification de algunos elementos;
- `role="list"` y `role="listitem"` para reforzar la estructura de lista.

En un curso de Web Components esto es importante porque un Custom Element no exime de escribir HTML accesible. El componente puede ser "custom", pero el contenido que renderiza debe seguir siendo semántico.

## Estilos Por Componente

Cada componente tiene su propio fichero CSS:

- `todo-add.css`
- `todo-list.css`
- `todo-item.css`
- `todo-container.css`

Esto refuerza el enfoque que estamos usando en el proyecto:

- lógica y estilo viven cerca;
- no usamos Shadow DOM;
- el alcance practico de estilos se consigue con selectores contextualizados por el tag del componente.

Es una forma muy didáctica de trabajar porque deja visible el DOM real y permite comprender mejor como se aplica el CSS a un componente web sin encapsulación nativa.

## Tests Como Parte Del Diseño

La feature no se ha dejado solo "funcionando a ojo". También se ha cubierto con tests.

Se han añadido pruebas para:

- el repositorio `TodosRepository`;
- el formulario `TodoAdd`;
- el item `TodoItem`;
- la lista `TodoList`;
- el contenedor `TodoContainer`.

Esto permite ensenar varias cosas:

- los componentes pequeños se pueden probar de forma aislada;
- la lógica de persistencia puede probarse sin navegador real;
- el contenedor puede validarse como punto de integration entre hijos y repositorio.

En otras palabras, la arquitectura no solo hace el código mas limpio: también lo hace mas testeable.

## Relación Con El Resto Del Curso

Esta implementación conecta con varios aprendizajes previos del proyecto:

- el router sigue siendo simple y comprensible;
- la idea de repositorio se reaprovecha;
- el uso de `register()` evita redefinir elementos;
- la pagina sigue el mismo patron estructural que `HomePage`, `FilmsPage` y `AboutPage`;
- los estilos se mantienen desacoplados por componente.

Por tanto, la `ToDo List` no es una pieza "extraña" dentro del repositorio, sino una extension natural del estilo arquitectónico del curso.

## Ideas Clave Que Deben Quedar Claras

- Un Web Component no tiene por que concentrar toda la lógica por si solo.
- Los Custom Elements pueden organizarse con patrones arquitectónicos serios.
- El DOM y los `CustomEvent` bastan para comunicar componentes de manera limpia.
- `localStorage` puede ocultarse detrás de un repositorio igual que una API remota.
- El ciclo de vida del componente es el lugar correcto para renderizar, escuchar y limpiar.
- Los tests ayudan a consolidar el diseño, no solo a detectar errores.

## Posibles Mejoras Futuras

La feature esta bien como ejercicio de curso, pero deja abiertas varias evoluciones interesantes:

- filtrado por tareas completadas y pendientes;
- contador separado en un componente propio;
- botón para borrar completadas;
- almacenamiento remoto mediante API;
- edición inline del titulo;
- uso de atributos observables para explorar `attributeChangedCallback`;
- comparativa entre esta implementation sin Shadow DOM y una variante con Shadow DOM.

## Conclusión

La `ToDo List` se ha utilizado como laboratorio de arquitectura frontend con Web Components. La implementation demuestra que, incluso en una SPA vanilla, es posible construir una feature bien separada en capas, con responsabilidades claras, componentes reutilizables, persistencia desacoplada y pruebas automatizadas.

Precisamente ese es uno de los mensajes mas importantes del curso: aprender Web Components no consiste solo en definir etiquetas nuevas, sino en entender como organizar una aplicación real sobre las APIs nativas del navegador.
