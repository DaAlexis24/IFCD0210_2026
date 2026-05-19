# Web Components

- [Web Components](#web-components)
  - [Custom elements.](#custom-elements)
    - [Naming conventions y namespaces](#naming-conventions-y-namespaces)
    - [Encapsulación y CSS](#encapsulación-y-css)
  - [Custom elements y ES: Web Components](#custom-elements-y-es-web-components)
    - [Custom elements como clases de ES](#custom-elements-como-clases-de-es)
      - [Elementos de las clases de ES](#elementos-de-las-clases-de-es)
      - [Registro del custom element](#registro-del-custom-element)
      - [Creación declarativa del custom element](#creación-declarativa-del-custom-element)
      - [Creación programática (imperativa) del custom element](#creación-programática-imperativa-del-custom-element)
      - [Ubicación del código de registro](#ubicación-del-código-de-registro)
    - [Ciclo de vida de un custom element](#ciclo-de-vida-de-un-custom-element)
    - [Estructura habitual y renderización](#estructura-habitual-y-renderización)
    - [Destrucción y limpieza de recursos](#destrucción-y-limpieza-de-recursos)
    - [Atributos](#atributos)
      - [Atributos y reactividad del componente](#atributos-y-reactividad-del-componente)
    - [Comunicación entre componentes](#comunicación-entre-componentes)
    - [Patrón Controlador/Presentadores](#patrón-controladorpresentadores)

## Custom elements.

Los custom elements son una parte fundamental de los Web Components, que permiten a los desarrolladores crear sus propios elementos HTML personalizados con su propio comportamiento y estilo.

Estos elementos pueden ser reutilizados en diferentes partes de una aplicación web o incluso en diferentes proyectos, lo que facilita la creación de interfaces de usuario consistentes y modulares.

### Naming conventions y namespaces

Estrictamente un **custom element** es una etiqueta HTML personalizada que respeta el convenio de nombres de HTML, pos lo que es reconocida como un **HTMLElement** en el DOM.

Ese convenio supone el uso de un guión en el nombre del elemento, lo que garantiza que no haya conflictos con los elementos HTML estándar presentes o futuros. Por ejemplo, `<my-button>` es un custom element válido, mientras que `<button>` no lo es, ya que es un elemento HTML estándar.

```js
const bad = document.createElement('bad');
bad instanceof HTMLElement; // false
bad.constructor.name; // "HTMLUnknownElement"
bad instanceof HTMLUnknownElement; // true
const myButton = document.createElement('my-button');
myButton instanceof HTMLElement; // true
myButton instanceof HTMLUnknownElement; // false
myButton.constructor.name; // "HTMLElement"
```

El prefijo del nombre del elemento puede considerarse como un espacio de nombres, lo que ayuda a organizar y categorizar los custom elements. El prefijo puede ser commún a todos los elementos de la aplicación o proyecto (e.b. app-), lo que facilita su identificación y uso. Por ejemplo, si estás creando una biblioteca de componentes de interfaz de usuario, podrías usar un prefijo como `ui-` para todos tus custom elements relacionados con la interfaz de usuario, como `<ui-button>`, `<ui-card>`, etc.

También es posible usar distintos prefijos para diferentes categorías de elementos dentro de la misma aplicación. Por ejemplo, podrías usar `form-` para elementos relacionados con formularios, como `<form-input>`, `<form-select>`, etc., y `layout-` para elementos relacionados con el diseño, como `<layout-grid>`, `<layout-flex>`, etc.

Incluso se podrían combinar ambos enfoques, usando un prefijo común para toda la aplicación y luego un segundo prefijo para categorizar los elementos. Por ejemplo, podrías usar `app-form-input` para un elemento de formulario dentro de una aplicación con el prefijo `app-`.

### Encapsulación y CSS

Loas custom elements pueden ser una forma simple de encapsular el aspecto de un componente (CSS) y utilizar atributos modificadores de estado. Los atributos de los custom elements pueden tener cualquier nombre (no siguen el convenio data-\*) y pueden ser usados para modificar el comportamiento o la apariencia del elemento.

```html
<warning-badge pulsing>En construcción</warning-badge>

<style>
  warning-badge {
    --stripe: 22px;
    --color: #ffe000;
    --glow: rgb(100% 90% 0 / 25%);

    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    color: var(--color);
    /* ... Estilos ... */
  }
  warning-badge::before {
    /* Exterior del badge */
  }

  warning-badge::after {
    /* Interior oscuro */
  }

  warning-badge[pulsing]::after {
    /* Animación de pantalla */
  }
</style>
```

Los estilos definidos para un custom element no proporcionan una verdadera encapsulación de estilo. Para lograr una encapsulación completa, es necesario usar Shadow DOM, que es otra parte fundamental de los Web Components.

Sin embargo al usar la propia etiqueta del custom element como selector CSS, se puede lograr una cierta encapsulación visual, ya que los estilos aplicados a ese selector solo afectarán a ese elemento específico y no a otros elementos en la página.

## Custom elements y ES: Web Components

En la práctica y para aprovechar sus posibilidades, los custom elements se suelen definir usando clases de ES6, lo que permite una sintaxis más clara y organizada. y los convierte en el elemento fundamentals (incluso el único) en la creación de un Web Components.

### Custom elements como clases de ES

Lo custom elements / web components pasan a estar basados en una clase de JavaScript que extiende de `HTMLElement` (o de otro tipo de elemento HTML, como `HTMLButtonElement`), lo que les permite heredar todas las propiedades y métodos de los elementos HTML estándar (querySelector, querySelectorAll, addEventListener...), además de agregar su propio comportamiento personalizado.

```js
class WarningBadge extends HTMLElement {
  constructor() {
    super();
    // Inicialización del componente
  }
}

customElements.define('warning-badge', WarningBadge);
```

Como en todos los casos de herencia (extends) en JavaScript, el constructor de la clase hija (custom element) debe llamar al constructor de la clase padre (HTMLElement) usando `super()`, lo que garantiza que el elemento se inicialice correctamente y tenga acceso a todas las funcionalidades del DOM.

#### Elementos de las clases de ES

Como en todas las clases de ES, los custom elements pueden tener propiedades y métodos, tanto privados (#) como públicos, que definen su comportamiento y estado. Además, pueden usar getters y setters para controlar el acceso a sus propiedades y realizar acciones adicionales cuando se modifican.

```js
class WarningBadge extends HTMLElement {
  #color = '#FFE000';
  constructor() {
    super();
    // Inicialización del componente
  }
  get color() {
    return this.#color;
  }
  set color(newColor) {
    this.#color = newColor;
    // Actualizar el estilo del componente con el nuevo color
  }
}
```

Igualmente pueden incluirse propiedades y métodos estáticos, que pertenecen a la clase en sí misma y no a las instancias del custom element. Estos pueden ser útiles para definir constantes, métodos de utilidad o cualquier funcionalidad que no dependa del estado de una instancia específica.

```js
class WarningBadge extends HTMLElement {
  static #defaultColor = '#FFE000';
  constructor() {
    super();
    this.style.color = WarningBadge.#defaultColor;
    // Inicialización del componente
  }
}
```

#### Registro del custom element

El último paso para definir un custom element es registrarlo con el navegador usando `customElements.define()`, lo que le asigna un **selector** o nombre de etiqueta personalizado (que debe seguir el convenio de nombres) y asocia esa etiqueta con la clase que define su comportamiento.

Esto se hace usando el método `customElements.define()`, que toma dos argumentos: el nombre del elemento personalizado (que debe seguir el convenio de nombres) y la clase que define su comportamiento.

```js
customElements.define('warning-badge', WarningBadge);
```

#### Creación declarativa del custom element

Cunado en html aparece el selector del custom element, el navegador crea una instancia de la clase asociada a ese selector, lo que permite que el elemento tenga su propio estado y comportamiento personalizado.

```html
<warning-badge></warning-badge>
```

Se puede decir que se trata de un ejemplo de **programación declarativa**: el desarrollador declara en el HTML que quiere usar un elemento personalizado, y el navegador se encarga de crear la instancia de ese elemento y aplicar su comportamiento definido en la clase.

#### Creación programática (imperativa) del custom element

En casos en que se necesite crear instancias de un custom element de forma programática (por ejemplo, en respuesta a una acción del usuario o como parte de la lógica de la aplicación), se pueden emplear dos estrategias, sempre después de haber registrado el custom element con `customElements.define()`:

- usar el método `document.createElement()` para crear una instancia del custom element, lo que también disparará el proceso de inicialización definido en su clase.

Una vez creada la instancia del custom element, se puede agregar en cualquier elemento del DOM usando métodos como `appendChild`, `insertBefore`, etc., lo que permitirá que el elemento se renderice en la página y tenga su comportamiento personalizado.

```js
const badge = document.createElement('warning-badge') as WarningBadge; // Crear una instancia del custom element
document.body.appendChild(badge);
```

- usar el operador `new` para crear una instancia de la clase del custom element, lo que también disparará el proceso de inicialización definido en su clase.

```js
const badge = new WarningBadge(); // Crear una instancia del custom element usando el operador new
document.body.appendChild(badge);
```

#### Ubicación del código de registro

Existen diversas estrategias para organizar el código relacionado con el custom element, dependiendo de la forma en que se register. En todas ellas la clase correspondiente al custom element se define en un módulo separado, lo que permite mantener el código más modular y organizado, además de facilitar la reutilización de la clase del custom element en diferentes partes de la aplicación o incluso en diferentes proyectos.

Una práctica común es definir la clase del custom element en un **módulo** separado, incluyendo al final de él la línea de código de registro. Al importar el modulo en el módulo principal de la aplicación, se ejecutará el código de registro y el custom element estará disponible para su uso en el HTML.

```js
class Footer extends HTMLElement {
  // Definición de la clase del custom element
  // ...

  static register() {
    customElements.define('app-footer', Footer);
  }
}
// En otro módulo o en el mismo módulo después de la definición de la clase
customElements.define('app-footer', Footer);
```

El problema de esta estrategia es que el código de registro se ejecutará cada vez que se importe el módulo, lo que puede generar problemas si el módulo se importa varias veces en diferentes partes de la aplicación. Para evitar esto, se comprobar previamente que el custom element no haya sido registrado ya.

```js
class Footer extends HTMLElement {
  constructor() {
    super();
    // Inicialización del componente
  }
}

if (!customElements.get('app-footer')) {
  customElements.define('app-footer', Footer);
}
```

El problema de esta estrategia es que obliga a importar una clase que aparentemente no se usa directamente en el código, lo que puede generar un aviso de herramientas como ESLint.

Para evitar esto, se puede encapsular el código de registro dentro de un método estático de la clase del custom element, lo que permite mantener toda la lógica relacionada con el custom element dentro de la misma clase y facilita su uso e importación.

```js
class Footer extends HTMLElement {
  constructor() {
    super();
    // Inicialización del componente
  }

  static register() {
    if (!customElements.get('app-footer')) {
      customElements.define('app-footer', Footer);
    }
  }
}
// En otro módulo o en el mismo módulo después de la definición de la clase
Footer.register();
```

Esta última estrategia es la que usaremos en nuestro código. Opcionalmente, el método de registro también podría incluir la lógica para otras operaciones sobre el componente:

- registrar otros componentes relacionados (por ejemplo, componentes hijos o dependientes), lo que permitiría centralizar toda la lógica de registro en un solo lugar. (e.g. Header registra Theme; App registra Header, Menu y Footer)

- crear una instancia del custom element y agregarla al DOM, lo que permitiría usar el custom element sin necesidad de declararlo explícitamente en el HTML. Por ejemplo, en las páginas que cargan dinámicamente contenido gracias al router.

```ts
export class HomePage extends HTMLElement {
  static selector = 'app-home-page';
  static register() {
    // Register custom element
    if (customElements.get(HomePage.#selector) === undefined) {
      customElements.define(HomePage.#selector, HomePage);
    }
    // Render child custom elements
    HomePage.#addPage();
  }
  static #addPage(selector = 'main') {
    // Prepare main
    const el: HTMLElement | null = document.querySelector(selector);
    if (el === null) {
      throw new Error(`Selector ${selector} no disponible`);
    }
    el.innerHTML = '';
    el.appendChild(new HomePage());
  }
  // Resto de la clase...
}
```

- recibir parámetros de configuración para el custom element, lo que permitiría personalizar su comportamiento o apariencia en función de las necesidades de la aplicación. Por ejemplo, el método de registro podría recibir un objeto con opciones de configuración que se asignarían a propiedades estáticas de la clase del custom element, lo que permitiría acceder a esas opciones desde cualquier instancia del elemento.

```ts
export class Menu extends HTMLElement {
  static #selector = 'app-menu';
  static #routes: Route[] = [];
  static register(routes: Route[]) {
    if (customElements.get(Menu.#selector) === undefined) {
      customElements.define(Menu.#selector, Menu);
    }
    Menu.#routes = routes;
    Menu.setOptions();
  }
  static setOptions(routes: Route[] = Menu.#routes) {
    const elements = document.querySelectorAll(Menu.#selector);
    elements.forEach((element) => {
      // DI de rutas a cada instancia de menu
      (element as Menu).routes = routes;
    });
  }
  // Resto de la clase...
}
```

En este ejemplo, el método `register` recibe un array de rutas que se asigna a una propiedad estática de la clase `Menu`. El método `setOptions` se encarga de asignar esas rutas a cada instancia del custom element, lo que permite que cada menú tenga acceso a las rutas definidas en el momento de su registro.

Esta forma de DI permitiría, opcionalmente, modificar las rutas de una instancia específica del menú en tiempo de ejecución, lo que podría ser útil para casos como la actualización dinámica de las opciones del menú en respuesta a cambios en la aplicación o a acciones del usuario.

### Ciclo de vida de un custom element

En base a una seríe de métodos especiales que se pueden definir en la clase del custom element, el navegador proporciona una serie de "hooks" o puntos de entrada que permiten ejecutar código en momentos específicos del ciclo de vida del elemento. Estos métodos son:

```js
// Código global del módulo, se ejecuta una sola vez cuando se carga el script

class Footer extends HTMLElement {
  constructor() {
    super();
    // Inicialización del componente
  }

  connectedCallback() {
    // Código que se ejecuta cuando el elemento se agrega al DOM
    // Sería como un constructor "dinámico" o "lazy" que se ejecuta cada vez que el elemento se inserta en la página
  }

  disconnectedCallback() {
    // Código que se ejecuta cuando el elemento se elimina del DOM
    // Sería similar al método "destructor" de otros lenguajes, que se ejecuta cada vez que el elemento se elimina de la página
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Código que se ejecuta cuando un atributo HTML cambia
  }
}
```

### Estructura habitual y renderización

- La estructura interna html del custom element se puede definir como un **template string** de ES

- El template string se puede incorporar en el DOM del custom element usando **innerHTML**, o su equivalente más moderno **setHTMLUnsafe()**, lo que permite crear una estructura HTML personalizada dentro del elemento.

(Actualmente setHTMLUnsafe es un método que no está disponible en todos los navegadores (entre 80-90% en canIUse), por lo que se recomienda usar innerHTML para garantizar la compatibilidad. En un futuro, está previsto que se haga frecuente el uso de **setHTML()** (actualmente 65% de soporte), que realizará comprobaciones de seguridad para impedir inyecciones de código. Es importante tener en cuenta que el uso de innerHTML o de setHTMLUnsafe puede introducir vulnerabilidades de seguridad si se inserta contenido no confiable, por lo que se debe usar con precaución y solo con contenido controlado.)

- este proceso puede encapsularse como un método, que puede denominarse render() o setElement, lo que facilita la actualización de la estructura interna del elemento cuando sea necesario.

- inicialmente el método de renderización se puede llamar desde el constructor o desde el método connectedCallback, lo que garantiza que el elemento tenga su estructura interna definida tan pronto como se cree una instancia del custom element.

```js
class WarningBadge extends HTMLElement {

  #template!: string;
  constructor() {
    super();
    // Preferible en connectedCallback, para evitar problemas de renderización prematura o de elementos no disponibles en el DOM
    // this.#render();
    this.#setTemplate();
  }

  connectedCallback() {
    this.#render(); // Llamado aquí, permitiría actualizar la estructura interna cada vez que el elemento se inserta en la página
    }


  #setTemplate() {
    this.#template = /*html*/ `
      <div class="badge">
        <span class="text">En construcción</span>
      </div>
    `;
  }
  #render() {
    this.innerHTML = this.#template;
    `;
  }
}
```

El comentario /_html_/ es una convención que se usa para indicar que el contenido del template string es HTML, lo que puede ayudar a los editores de código a proporcionar resaltado de sintaxis y otras funciones de edición específicas para HTML dentro del template string. En VSC esto se puede conseguir con la extensión "es6-string-html" o similar.

### Destrucción y limpieza de recursos

El método `disconnectedCallback` se ejecuta cada vez que el custom element se elimina del DOM, lo que permite realizar tareas de limpieza y liberación de recursos asociados al elemento. Esto es especialmente importante para evitar fugas de memoria y garantizar un rendimiento óptimo de la aplicación.

En el método `disconnectedCallback`, se pueden realizar acciones como:

- eliminar event listeners asociados al elemento, lo que evita que sigan activos después de que el elemento haya sido eliminado del DOM.
- liberar recursos asociados al elemento, como timers, conexiones a bases de datos, etc., lo que garantiza que no queden recursos abiertos o en uso después de que el elemento haya sido eliminado.
- realizar cualquier otra tarea de limpieza necesaria para garantizar que el elemento se elimine de forma segura y eficiente del DOM

En el componente Menu, cuando se despliega como un dropdown, se añade un event listener al documento para detectar clics fuera del menú y cerrarlo. Si el menú se elimina del DOM sin eliminar ese event listener, el listener seguirá activo y podría generar errores o comportamientos inesperados al intentar acceder a elementos que ya no existen en la página.

```js
class Menu extends HTMLElement {
  // ...

  connectedCallback() {
    // Lógica de inicialización del menú
    document.addEventListener('click', (this.handleDocumentClick));
  }

  disconnectedCallback() {
    // Lógica de limpieza del menú
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick = (event) => {
    // Lógica para cerrar el menú si se hace clic fuera de él
  };
}
```

Hay que recordar que para poder eliminar un event listener, es necesario usar la misma función que se usó para agregarlo, no pudiendo ser una función anónima, por lo que en este ejemplo se define `handleDocumentClick` como una propiedad de clase con una función flecha, lo que garantiza que se mantenga la misma referencia a la función tanto al agregar como al eliminar el event listener.

### Atributos

Como hemos visto Los atributos de un custom element puede emplear cualquier nombre (no siguen el convenio data-\*) y es frecuento recoger sus valores como propiedades de la clase del custom element, preferiblemente en el método connectedCallback, para garantizar que el elemento esté completamente inicializado y disponible en el DOM antes de acceder a sus atributos.

```js
class WarningBadge extends HTMLElement {
  constructor() {
    super();
    // Inicialización del componente
  }

  connectedCallback() {
    this.color = this.getAttribute('color') ?? '#FFE000';
    this.pulsing = this.hasAttribute('pulsing') ?? false;
    // Resto de la inicialización del componente
  }
}
```

En cuanto al tipo, los atributos de un custom element siempre se representan como cadenas de texto (string) en el HTML, por lo que es necesario realizar conversiones de tipo si se desea trabajar con otros tipos de datos (booleanos, números, objetos, etc.) en las propiedades.

#### Atributos y reactividad del componente

Los cambios en los atributos de un custom element pueden ser usados para modificar su comportamiento o apariencia.

Para que el navegador pueda detectar los cambios en los atributos, es necesario definir un getter de array estático llamado `observedAttributes` en la clase del custom element, que contenga los nombres de los atributos que se desean observar.

```js
class WarningBadge extends HTMLElement {
  static get observedAttributes() {
    return ['color', 'pulsing'];
  }
  // ...
}
```

Una vez definidos los atributos a observar, el navegador llamará al método `attributeChangedCallback` cada vez que uno de esos atributos cambie, pasando como argumentos el nombre del atributo, su valor anterior y su nuevo valor. Esto permite actualizar el estado o la apariencia del custom element en respuesta a los cambios en sus atributos.

```js
class WarningBadge extends HTMLElement {
  static get observedAttributes() {
    return ['color', 'pulsing'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color') {
      this.style.color = newValue;
    } else if (name === 'pulsing') {
      if (newValue !== null) {
        this.classList.add('pulsing');
      } else {
        this.classList.remove('pulsing');
      }
    }
  }
}
```

En el ejemplo los cambios afectas all css por lo que serán aplicaos automáticamente por el navegador. También podrían afectar a otras partes del comportamiento del custom element, como su lógica interna, su estructura HTML, etc. siendo con frecuencia necesario llamar a un método de renderización (render o setElement antes mencionado) para actualizar la apariencia del elemento en respuesta a los cambios en sus atributos.

Para que el cambio en el atributo se refleje en el HTML, es necesario usar el método `setAttribute` para modificar el valor del atributo, lo que a su vez disparará el método `attributeChangedCallback` y permitirá actualizar la apariencia o el comportamiento del custom element en consecuencia.

```js
const badge = document.querySelector('warning-badge');
badge.setAttribute('color', '#FF0000'); // Cambia el color del badge a rojo
badge.setAttribute('pulsing', ''); // Activa la animación de pulsación
badge.removeAttribute('pulsing'); // Desactiva la animación de pulsación
badge.color = '#00FF00'; // Cambia el color del badge a verde usando la propiedad JS, pero NO cambia el atributo HTML, por lo que NO disparará el callback
```

### Comunicación entre componentes

- mediante atributos: desde el componente que contiene a otro componente, se puede definir el valor de un atributo del componente hijo.

```html
<warning-badge color="#FF0000" pulsing></warning-badge>
```

- mediante métodos públicos (opcionalmente setters): desde el componente que contiene a otro componente, se puede acceder a una instancia del componente hijo usando `querySelector` o similar, y luego llamar a sus métodos públicos para modificar su estado o comportamiento.

``js
class WarningBadge extends HTMLElement {
// ...

set color(newColor) {
this.style.color = newColor;
}
}

````

```js
const badge = document.querySelector('warning-badge');
badge.color = '#FF0000'; // Cambia el color del badge a rojo usando un setter definido en la clase del custom element
````

- mediante eventos personalizados: desde el componente hijo, se pueden disparar eventos personalizados usando `dispatchEvent`, lo que permite que el componente padre escuche esos eventos y responda en consecuencia.

```js
class WarningBadge extends HTMLElement {
  // ...

  someMethod() {
    // Lógica del método
    const event = new CustomEvent('badgeClicked', {
      detail: {
        /* datos adicionales */
      },
    });
    this.dispatchEvent(event);
  }
}
```

```js
const badge = document.querySelector('warning-badge');
badge.addEventListener('badgeClicked', (event) => {
  console.log('El badge fue clickeado', event.detail);
});
```

### Patrón Controlador/Presentadores

El patrón Controlador/Presentador es una arquitectura de diseño que se puede aplicar a los custom elements para separar la lógica de presentación (renderización y manejo de eventos) de la lógica de negocio (gestión del estado...). En este patrón, el custom element actúa como un presentador que se encarga de renderizar la interfaz de usuario y manejar las interacciones del usuario, mientras que un controlador externo se encarga de gestionar el estado y la lógica de negocio del componente.

Veamos un ejemplo con una lista de tareas (todo list) donde el custom element se encarga de renderizar la lista y manejar los eventos de clic, mientras que un controlador externo gestiona el estado de las tareas.

El componente task-item es el presentador que se encarga de renderizar cada tarea y manejar sus interacciones, mientras que el controlador gestiona el estado general de la lista.

```js
class TaskItem extends HTMLElement {
  task = null; // La tarea se asignará externamente
  constructor() {
    super();
  }

  set task(newTask) {
    this.task = newTask;
    this.render();
  }

  render() {
    if (!this.task) return;

    this.innerHTML = `
      <div class="task-item">
        <span>${this.task.text}</span>
        <button id="deleteTask">Delete</button>
      </div>
    `;

    this.querySelector('#deleteTask').addEventListener('click', () => {
      const event = new CustomEvent('deleteTask', {
        detail: { taskId: this.task.id },
      });
      this.dispatchEvent(event);
      this.render(); // Re-renderizar el item después de eliminar la tarea
    });
  }
}
customElements.define('task-item', TaskItem);
```

```js
class TodoList extends HTMLElement {

  tasks = []; // Las tareas se asignarán externamente
  constructor() {
    super();

  }

  set tasks(newTasks) {
    this.tasks = newTasks;
    this.render();
  }

  render() {
    if (!this.tasks) return;

    this.innerHTML = `
      <ul></ul>
      <button id="addTask">Add Task</button>
    `;

    // Una opción es: dentro del ul
    // ${this.tasks.map(task => `<task-item task='${JSON.stringify(task)}'></task-item>`).join('')}

    // La otra opción es: crear cada task-item como un custom element independiente, lo que permite una mayor flexibilidad y control sobre cada tarea individualmente

    this.tasks.forEach(task => {
      const taskItem = document.createElement('task-item') as TaskItem; // Crear una instancia del custom element
      taskItem.task = task; // Asignar la tarea al custom element
      this.querySelector('ul').appendChild(taskItem);
    });

  }
}

customElements.define('todo-list', TodoList);
```
