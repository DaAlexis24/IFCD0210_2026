# Testing de aplicaciones web. Tests en el frontend

- [Testing de aplicaciones web. Tests en el frontend](#testing-de-aplicaciones-web-tests-en-el-frontend)
  - [Entorno y herramientas](#entorno-y-herramientas)
    - [Proyecto React creado con Vite](#proyecto-react-creado-con-vite)
      - [Configuración de Vitest en un proyecto Vite](#configuración-de-vitest-en-un-proyecto-vite)
    - [testing library](#testing-library)
      - [Mejorar el uso de los matchers extra de @testing-library/jest-dom](#mejorar-el-uso-de-los-matchers-extra-de-testing-libraryjest-dom)
  - [Test de un componente de React](#test-de-un-componente-de-react)
    - [🧿Componente Footer](#componente-footer)
    - [Métodos del objeto screen](#métodos-del-objeto-screen)
    - [Test de 'caja negra' y 'caja blanca'](#test-de-caja-negra-y-caja-blanca)
  - [Test básicos de componentes](#test-básicos-de-componentes)
    - [Test de componentes de React con props](#test-de-componentes-de-react-con-props)
      - [🧿Componente Header](#componente-header)
    - [Estado e Interacciones del usuario](#estado-e-interacciones-del-usuario)
      - [🧿Componente Counter](#componente-counter)
      - [Simular eventos con fireEvent](#simular-eventos-con-fireevent)
      - [Simular eventos con userEvent](#simular-eventos-con-userevent)
    - [Composición de Componentes: propiedad children](#composición-de-componentes-propiedad-children)
      - [🧿Componente Card](#componente-card)
    - [Componentes y tests de integración](#componentes-y-tests-de-integración)
      - [🧿Componente App con componentes hijos](#componente-app-con-componentes-hijos)
        - [Test de integración o de aceptación](#test-de-integración-o-de-aceptación)
        - [Test de unitario del componente App](#test-de-unitario-del-componente-app)
    - [🧿En resumen ... y el coverage](#en-resumen--y-el-coverage)
  - [Más test de componentes: nuevo proyecto de React](#más-test-de-componentes-nuevo-proyecto-de-react)
    - [Páginas y rutas](#páginas-y-rutas)
      - [🧿Componente HomePage](#componente-homepage)
      - [🧿Componentes NotesPage y AboutPage](#componentes-notespage-y-aboutpage)
      - [Reubicando el componente Counter](#reubicando-el-componente-counter)
      - [Rutas y navegación](#rutas-y-navegación)
        - [Data (Programática)](#data-programática)
        - [Provider y Rutas](#provider-y-rutas)
      - [Test de las rutas](#test-de-las-rutas)
        - [Test de componentes con rutas (modo antiguo o declarativo)](#test-de-componentes-con-rutas-modo-antiguo-o-declarativo)
        - [🧿Componente Menu: navegación](#componente-menu-navegación)
        - [Test del componente Menu](#test-del-componente-menu)
      - [Carga diferida (Lazy loading) de las páginas](#carga-diferida-lazy-loading-de-las-páginas)
        - [Test de las rutas con carga diferida: waitFor](#test-de-las-rutas-con-carga-diferida-waitfor)
    - [Formularios](#formularios)
      - [Añadiendo una página](#añadiendo-una-página)
      - [Formulario controlado](#formulario-controlado)
        - [🧿Componente Formulario de registro](#componente-formulario-de-registro)
        - [Test del formulario de registro](#test-del-formulario-de-registro)
    - [Test de componentes asíncronos](#test-de-componentes-asíncronos)
      - [🧿Componente LoggedUser](#componente-loggeduser)
    - [Test de componentes de React con context](#test-de-componentes-de-react-con-context)
      - [Acceso al contexto](#acceso-al-contexto)
  - [Pruebas instantáneas: Snapshots](#pruebas-instantáneas-snapshots)
    - [¿Cómo Funcionan las Pruebas de Instantáneas?](#cómo-funcionan-las-pruebas-de-instantáneas)
    - [Paso a Paso: Creando una Prueba de Instantánea](#paso-a-paso-creando-una-prueba-de-instantánea)

## Entorno y herramientas

### Proyecto React creado con Vite

De las diversas formas con las que podemos crear un proyecto que utilice React,una de las más habituales actualmente, después de qye Create React App haya quedado descontinuado, es con Vite.

Vite es un entorno de desarrollo que permite crear aplicaciones web modernas con React, Vue, Svelte y Vanilla JavaScript. Vite proporciona un entorno de desarrollo rápido y eficiente, con recarga en caliente y construcción rápida, gracias a su arquitectura basada en ESM (ECMAScript Modules). Para crear un proyecto con Vite y React, ejecutamos el siguiente comando:

```sh
npm create vite@latest my-react-app --template react
```

En el proyecto debemos añadir Vitest y configurarlo de forma un poco diferente a como explicamos en la unidad correspondiente al backend.

#### Configuración de Vitest en un proyecto Vite

Para configurar Vitest en un proyecto Vite, debemos instalar las siguientes dependencias:

```sh
npm install -D vitest @vitest/coverage-v8
```

A continuación, debemos crear un archivo de configuración para Vitest en la raíz del proyecto, llamado `vitest.config.ts`, con el siguiente contenido:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // opcionalmente
    include: ['**/*.test.ts', '**/*.test.tsx'],
    // opcionalmente, para configurar la cobertura
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/**/types/*.ts'],
    },
  },
});
```

Se actualiza `tsconfig.app.json` y `tsconfig.node.json` añadiendo `vitest` al array `types`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"] // Opcionalmente también "vite/client" si se usa HMR
  }
}
```

Finalmente puede se interesante agregar un script para ejecutar las pruebas en tu archivo `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

### testing library

Cuando creamos una aplicación web del lado cliente (frontend) esta se ejecuta en un navegador web. Por lo tanto, para probarla necesitamos un entorno de pruebas que simule un navegador y nos permita interactuar con la aplicación como lo haría un usuario real. En principio, las pruebas que realiza Jest no aportan esta funcionalidad, ya que Jest es un entorno de pruebas para Node.js y no simula un navegador. Para conseguirlo debemos instalar una librería adicional que nos permita realizar pruebas en un entorno de navegador simulado.

```sh
npm i -D jsdom
```

A continuación modificaremos la configuración de Vitest para que utilice jsdom como entorno de pruebas, añadiendo un nuevo valor en el fichero vitest.config.ts

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

Con esto podemos ejecutar pruebas que interactúen con el DOM de la página, como por ejemplo comprobar que un elemento se muestra o se oculta correctamente. Sin embargo, Jest no proporciona una forma sencilla acceder a los elementos del DOM simulado ni de simular la interacción del usuario con la página, como hacer clic en un botón o rellenar un formulario. Existen varias librería adicionales que facilitan gestionar el DOM y simular la interacción del usuario con la página, como por ejemplo [Enzyme](https://enzymejs.github.io/enzyme/) o [Testing Library](https://testing-library.com/) que es la que usaremos nosotros.

Testing Library es en realidad una colección de librerías que nos permiten realizar de forma sencilla y eficaz, pruebas de aplicaciones en vanilla JavaScript y de componentes de frameworks como React, Angular, Vue, Svelte, etc.

En el caso de **vanilla JavaScript**, Testing Library proporciona

- la librería `@testing-library/dom`, que nos permite interactuar con el DOM de la página de forma sencilla y eficaz. Para instalarla ejecutamos el siguiente comando:

```sh
npm i -D @testing-library/dom @testing-library/jest-dom testing-library/user-event
```

- La segunda librería que vamos a instalar es `@testing-library/jest-dom`, que proporciona matchers adicionales para Jest con el fin de realizar comprobaciones sobre el DOM de la página.
- Por último, la librería `testing-library/user-event` nos facilita simular la interacción del usuario con la página, como hacer clic en un botón o rellenar un formulario, enfocándose siempre en la perspectiva del usuario.

En nuestro caso, para testar los componentes de **React**, vamos a utilizar la librería `@testing-library/react` junto con las otras mencionadas anteriormente. Para instalarla ejecutamos el siguiente comando:

```sh
npm i -D @testing-library/react @testing-library/jest-dom testing-library/user-event
```

#### Mejorar el uso de los matchers extra de @testing-library/jest-dom

`testConfig.ts` to src folder:

```ts
import '@testing-library/jest-dom/vitest';
```

Update `vite.config.ts` to add the `setupFiles` property:

```ts
setupFiles: ['src/testConfig.ts'],
```

## Test de un componente de React

### 🧿Componente Footer

A partir de la App inicial creada por Vite, vamos a extraer el siguiente componente de React, para luego testarlo

```tsx
// src/components/footer/footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </footer>
  );
};
```

Para testar este componente, creamos un fichero footer.test.tsx en el mismo directorio que el componente y escribimos el siguiente código:

```tsx
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('Footer component', () => {
  it('should render correctly', () => {
    render(<Footer />);
    const footerElement = screen.getByText(
      /Click on the Vite and React logos to learn more/i
    );
    expect(footerElement).toBeInTheDocument();
  });
});
```

Como se puede ver usamos varios elementos de Testing Library para testar el componente:

- La **función render** permite renderizar el componente Counter en el DOM simulado.
- El **objeto screen** proporciona funciones para obtener elementos del DOM simulado, como getByText que obtiene un elemento que contenga un texto determinado.

En el test, comprobamos que el elemento correspondiente al componente está en el DOM simulado. Disponemos para ello de uno de los **matchers** mas utilizados entre los que aporta la librería con la función expect(textElement).**toBeInTheDocument()**.

Si hemos hecho los cambios indicados en la configuración, no será necesario importar `@testing-library/jest-dom` en cada fichero de test, ya que los matchers adicionales estarán disponibles globalmente.

### Métodos del objeto screen

El objeto screen proporciona varios métodos para obtener elementos del DOM simulado que utilizan tres estrategias diferentes para buscar elementos:

- getBy: Retorna el nodo que corresponde a la búsqueda y lanza un error si no encuentra el elemento.
- queryBy: Retorna el nodo que corresponde a la búsqueda y null si no encuentra el elemento.
- findBy: Devuelve una promesa que se resuelve cuando encuentra el elemento, por lo que se utiliza para elementos que se renderiza de forma asíncrona.

En los tres casos existe una variante que permite buscar elementos por distintos atributos, como por ejemplo:

- getAllBy: Retorna un array con los nodos que corresponden a la búsqueda y lanza un error si no encuentra ninguno.
- queryAllBy: Retorna un array con los nodos que corresponden a la búsqueda y un array vacío si no encuentra ninguno.
- findAllBy: Devuelve una promesa que se resuelve cuando encuentra los elementos, por lo que se utiliza para elementos que se renderizan de forma asíncrona.

Además, los métodos de cualquiera de estos 6 tipos pueden buscar elementos por distintos atributos, que pueden ordenarse en función de la prioridad con la que la librería recomienda su uso:

1. Queries accesibles
   - getByRole: Busca un elemento por su rol.
   - getByLabelText: Busca un elemento por su etiqueta.
   - getByPlaceholderText: Busca un elemento por su texto de marcador de posición.
   - getByText: Busca un elemento que contenga un texto determinado.
   - getByDisplayValue: Busca un elemento por su valor de visualización.
2. Queries semánticas
   - getByAltText: Busca un elemento por su texto alternativo.
   - getByTitle: Busca un elemento por su título.
3. Queries por ID
   - getByTestId: Busca un elemento por su atributo data-testid.

El criterio de ordenación corresponde a las ideas del autor de la librería, **Kent C. Dodds**, que recomienda utilizar los métodos de la primera categoría siempre que sea posible, ya que son los más accesibles y semánticos, reflejando la forma en la que los usuarios interactúan con la página. En caso de no poder utilizarlos, se recomienda utilizar los métodos de la segunda categoría y, en último lugar, los métodos de la tercera categoría.

En el caso de los métodos de la tercera categoría, **getByTestId** es el único que no se basa en la apariencia del elemento, sino en su propósito, por lo que es el único que se recomienda utilizar en caso de no poder utilizar los métodos de las dos primeras categorías. Para indicar ese propósito, se prescinde del uso de selectores habituales de CSS, incluidos class o id, como identificadores de elementos basados en la apariencia, como clases o y se utiliza un atributo data-testid con un valor que refleje el propósito del elemento. Recordemos que los atributos data-\* son atributos personalizados que permiten almacenar información adicional sobre un elemento en el DOM.

En cuanto al primero de los métodos, **getByRole**, es el más recomendado por la librería, ya que refleja la forma en la que los usuarios interactúan con la página. Para ello, se basa en el **atributo role** de los elementos del DOM, que es un atributo que permite añadir información semántica a los elementos del DOM, indicando su propósito o función. Este atributo se introdujo en el HTML a partir de otro estándar del W3C conocido como **ARIA** (Accessible Rich Internet Applications), donde se definen un conjunto de valores que reflejan el role que juega un elemento, para permitir mejorar la accesibilidad de las aplicaciones web. Muchas etiquetas HTML tienen un role implícito, pero en algunos casos es necesario añadir un role explícito para mejorar la accesibilidad de la aplicación, utilizando el **atributo role**. Por ejemplo, un botón tiene un role de `button`, un enlace tiene un role de `link`. Si un elemento que no es un botón ni un enlace se comporta como un botón o un enlace, se le puede añadir un role de `button` o `link`.

### Test de 'caja negra' y 'caja blanca'

En los **tests de 'caja negra'** se prueba el componente como una caja cerrada, es decir, sin conocer su implementación interna. Se trata de probar el componente como si fuera una caja negra, sin conocer cómo está implementado internamente. En este tipo de test se prueban las entradas y salidas del componente, es decir, se prueban los props que recibe el componente y los elementos que se muestran en el DOM. En nuestro sencillo ejemplo, podemos comprobar que el texto del componente es el esperado, pero no podemos comprobar cómo se obtiene a partir de la variable title, ya que en ese caso estaríamos accediendo a la implementación del componente.

Este tipo de test es propuesto por la testing library, ya que se centra en la funcionalidad del componente tal como la percibe el usuario y no en su implementación interna Esto ayuda a enfocar la atención en la usabilidad y accesibilidad del componente y permite realizar cambios en la implementación sin tener que modificar los tests.

En los **tests de 'caja blanca'** se prueba el componente como una caja abierta, es decir, conociendo su implementación interna. Se trata de probar el componente conociendo cómo está implementado internamente. En este tipo de test se prueban los métodos y propiedades internas del componente, como puede ser sus estados. En nuestro caso podríamos comprobar el valor de la variable title, que es un estado del componente.

La testing library no recomienda este tipo de test, ya que se centra en la implementación interna del componente y no en su funcionalidad. En consecuencia no proporciona ninguna función para acceder a los estados internos del componente. Las razones esgrimidas por el autor de la librería son que este tipo de test no aporta valor al usuario, ya que se centra en la implementación interna del componente y no en su funcionalidad, sin aportar información sobre la usabilidad y accesibilidad del componente. Ademas, depender de la implementación hace que los tests sean más frágiles y se rompan con más facilidad al realizar cambios en el código. Estos argumentos cobran más sentido cuando se reduce al mínimo la lógica interna del componente, abstraiéndola a otras capas, como `custom hooks` o `servicios`.

Sin embargo, eso no siempre sucede y los tests de caja blanca son comunes en la práctica, cuando se necesita testar la lógica interna del componente. Otras librerías como **Enzyme**, que como ya mencionamos, también es muy utilizada para testar componentes de React, proporcionan funciones para acceder a los estados internos del componente y testarlos. Lo mismo sucede en el caso de **Angular**, donde se pueden testar los estados internos de los componentes con la combinación de Jasmine y Karma junto con las herramientas de testing específicas del framework.

## Test básicos de componentes

### Test de componentes de React con props

En ocasiones, los componentes de React reciben props que afectan a su comportamiento o a su apariencia. Para testar estos componentes, necesitamos renderizar el componente con las props correspondientes y comprobar que se comporta de la forma esperada. Para ello, Testing Library proporciona la función **render** que nos permite renderizar el componente con las props correspondientes.

#### 🧿Componente Header

A partir de la App inicial creada por Vite, vamos a extraer el siguiente componente de React, para luego testarlo

```tsx
// src/components/header/header.tsx

import React from 'react';
import reactLogo from '../../assets/react.svg';
import viteLogo from '/vite.svg';
import './header.css';

type Props = {
  title: string;
};

export const Header: React.FC<Props> = ({ title }) => {
  return (
    <header>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{title}</h1>
    </header>
  );
};
```

Para testar este componente, creamos un fichero header.test.tsx en el mismo directorio que el componente y escribimos el siguiente código:

```tsx
// src/components/header/header.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './header';

describe('Header component', () => {
  test('should render the title received as prop', () => {
    render(<Header title="Título de prueba" />);
    const textElement = screen.getByText(/Título/i);
    expect(textElement).toBeInTheDocument();
  });
});
```

En este test, renderizamos el componente Header con la prop title="Título de prueba" y comprobamos que se muestra el texto correspondiente en el DOM simulado. La función render recibe el componente Header con la prop title="Título de prueba" y renderiza el componente en el DOM simulado.

### Estado e Interacciones del usuario

Los componentes de React suelen tener un **estado interno**, creado gracias al hook `useState` que puede cambiar en función de la interacción del usuario con el componente. Para testar estos componentes, necesitamos simular la interacción del usuario con el componente, como hacer clic en un botón o rellenar un formulario. Para ello, Testing Library proporciona la función **fireEvent** que nos permite simular eventos del usuario, como hacer clic en un botón o rellenar un formulario.

#### 🧿Componente Counter

Vamos a extraer un nuevo componente de React a partir de la App inicial, para luego testarlo:

```tsx
// src/components/counter.tsx
import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
};
```

Para testar este componente, creamos un fichero Counter.test.tsx en el mismo directorio que el componente y escribimos el siguiente código:

```tsx
// src/components/counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './counter';

describe('Counter component', () => {
  test('should start with 0', () => {
    render(<Counter />);
    const textElement = screen.getByText(/count is 0/i);
    expect(textElement).toBeInTheDocument();
  });
});
```

En el primer test, sin haber hecho clic comprobamos que el elemento correspondiente al componente está en el DOM simulado. Como ya hemos visto, para ello utilizamos los dos elementos básicos de Testing Library, la función render y el objeto screen, junto con el matcher toBeInTheDocument. la librería con la función expect(textElement).toBeInTheDocument(). Al mismo tiempo estamos testando que el contador se inicializa a 0, al comprobar como este valor se refleja en la vista renderizada por el componente. Vemos pòr tanto el carácter de test de 'caja negra' de este tipo de test.

```tsx
describe('Counter component', () => {
  // ...

  test('should increase after click the button with click()', async () => {
    render(<Counter />);
    const buttonElement = screen.getByRole('button', { name: /count is/i });
    await buttonElement.click();
    const textElement = screen.getByText(/count is 1/i);
    expect(textElement).toBeInTheDocument();
  });
});
```

En el segundo test, simulamos un clic en el botón Haz clic con el método nativo click del elemento obtenido con getByRole y comprobamos que el texto Has hecho clic 1 veces está en el DOM simulado, es decir que a traves de la vista comprobamos como ha cambiado el estado interno del componente. El método click del elemento simula un clic en el botón.

Como consecuencia del evento click, el estado puede cambiar, y por tanto se renderizará de nuevo el componente. Es una forma de asincronía, pero al usar el await antes del click, TS nos indica que "await" no tiene efecto en el tipo de esta expresión, lo cual no es cierto, porque el test funciona.

Sin embargo Vitest no reconoce que el estado puede cambiar como consecuencia del evento click, por lo que nos advierte de que el test puede no funcionar correctamente. Para evitar este problema, debemos envolver la llamada al método click en una **función act**, que nos permite asegurarnos de que todos los cambios de estado se han aplicado antes de continuar con el test. De esta forma, Vitest reconoce que el estado puede cambiar como consecuencia del evento click y no nos advierte de que el test puede no funcionar correctamente.

Act es una función una función proporcionada por React y replicada en la librería `react-dom/test-utils`, por lo que podemos importarla de cualquiera de los dos sitios. En este caso, la importamos de `react-dom/test-utils` :

```tsx
import { act } from 'react-dom/test-utils';
test('should increase after click the button with click()', async () => {
  render(<Counter />);
  const buttonElement = screen.getByRole('button', { name: /count is/i });

  // Es válido pero Vitest no reconoce que el estado puede cambiar
  // como consecuencia del evento click, por lo que dad una advertencia
  // await buttonElement.click();

  await act(async () => {
    buttonElement.click();
  });
  const textElement = screen.getByText(/count is 1/i);
  expect(textElement).toBeInTheDocument();
});
```

Existen dos alternativas al método click del elemento, que en ambos casos son validas para otros muchos eventos del usuario, como rellenar un formulario o mover el ratón.

#### Simular eventos con fireEvent

FireEvent es un objeto que proporciona una serie de métodos para simular eventos del usuario, como hacer clic en un botón o rellenar un formulario. Por ejemplo, fireEvent.click simula un clic en un botón, mientras que fireEvent.change simula el evento de cambio de un campo de texto.

```ts
// src/components/counter.test.tsx
test('should increase after click the button with fireEvent', () => {
  render(<Counter />);
  const buttonElement = screen.getByRole('button', { name: /count is/i });
  fireEvent.click(buttonElement);
  const textElement = screen.getByText(/count is 1/i);
  expect(textElement).toBeInTheDocument();
});
```

En el segundo test en este caso, simulamos un clic en el botón Haz clic con la función fireEvent.click y comprobamos que el texto Has hecho clic 1 veces está en el DOM simulado, es decir que a traves de la vista comprobamos como ha cambiado el estado interno del componente. El objeto fireEvent proporciona una serie de métodos para simular eventos del usuario, y ya utiliza internamente la función act, por lo que no necesitamos añadirla.

#### Simular eventos con userEvent

La propia testing library proporciona una segunda librería, **testing-library/user-event**, que incluye una serie de métodos para simular eventos, como hacer clic en un botón o rellenar un formulario de una forma mas realista, como si un usuario real estuviera interactuando con la página.

Por ejemplo, userEvent.type simula la escritura de un texto en un campo de texto, mientras que fireEvent.change simula el evento de cambio de un campo de texto.

El test resultante quedaría como sigue:

```tsx
// src/components/counter.test.tsx
test('should increase after click the button with userEvent', async () => {
  render(<Counter />);
  const buttonElement = screen.getByRole('button', { name: /count is/i });
  await userEvent.click(buttonElement);
  const textElement = screen.getByText(/count is 1/i);
  expect(textElement).toBeInTheDocument();
});
```

En userEvent, los eventos son realmente **asíncronos**, siendo el valor devuelto una promesa, por lo que debemos esperar a que se resuelva la operación antes de comprobar el resultado. Para ello, la función es **async** y utilizamos la palabra clave **await** antes de userEvent.click.

### Composición de Componentes: propiedad children

La propiedad **children** es una propiedad especial de los componentes de React que permite componer componentes de forma jerárquica. La propiedad children permite pasar elementos hijos a un componente, que pueden ser otros componentes o elementos HTML.

Para testar estos componentes, necesitamos renderizar el componente con los elementos hijos previstos y comprobar que se comporta de la forma esperada. Para ello, Testing Library proporciona la función **render** que ya hemos utilizado y que nos permite renderizar el componente con los elementos hijos correspondientes.

#### 🧿Componente Card

De nuevo vamos a extraer un nuevo componente de React a partir de la App inicial, para luego testarlo:

```tsx
// src/components/card.tsx
import React from 'react';

type CardProps = {
  title?: string;
} & React.PropsWithChildren;

export const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className="card">
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  );
};
```

Nuestro componente Counter utilizará Card para mostrar su contenido, y opcionalmente podremos pasarle un título a través de la prop title:

```tsx
// src/components/counter.tsx
import React, { useState } from 'react';
import { Card } from './card';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <Card title="Contador">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </Card>
  );
};
```

Em el test del componente Card, tendremos que renderizar el componente Card con un título y algunos elementos hijos, y comprobar que se muestran correctamente en el DOM. Como el título es opcional, también deberemos comprobar el caso en el que no se proporciona un título.

```tsx
// src/components/card.test.tsx
import { render, screen } from '@testing-library/react';
import { Card } from './card';

describe('Card component', () => {
  test('should render with title and children', () => {
    render(
      <Card title="Card Title">
        <p>Card content</p>
      </Card>
    );
    const titleElement = screen.getByText(/card title/i);
    const contentElement = screen.getByText(/card content/i);
    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
  });

  test('should render without title', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    const contentElement = screen.getByText(/card content/i);
    expect(contentElement).toBeInTheDocument();
  });
});
```

### Componentes y tests de integración

Los test de los componentes suelen considerarse **test de integración**, ya que implican un componente con su interfaz gráfica y su lógica y muchas veces incluyen además la interacción con otros componentes incluidos en el que estamos testando. En este tipo, gracias a la Testing Library, lo primero que debemos hacer es **renderizar** el componente, junto con sus "hijos", en un contenedor del DOM simulado. A continuación, podemos **interactuar** con el componente y comprobar que se comporta de la forma esperada.

#### 🧿Componente App con componentes hijos

Nuestro componente App incluye varios componentes hijos, como Header, Counter y Footer.

```tsx
// src/components/app.tsx
import { Header } from './header';
import { Counter } from './counter';
import { Footer } from './footer';

export const App: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Counter />
      </main>
      <Footer />
    </>
  );
};
```

Lo hemos refactorizado como arrow y exportado con nombre para seguir el mismo patrón que en los otros componentes, reubicándolo en su propia carpeta `src/components/app`.

Como consecuencia haremos un ajuste en el fichero `src/main.tsx` para importar el componente App correctamente y respetar las normas de TypeScript no utilizando el null assertion operator (!):

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find the root element');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

##### Test de integración o de aceptación

Podemos a testar el componente App completo, comprobando que se renderizan correctamente los componentes hijos y que se comportan de la forma esperada.

```tsx
// src/components/app.acceptance.test.tsx
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App component (acceptance test)', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('should render Header', () => {
    const headerElement = screen.getByRole('heading', {
      name: /react with typescript/i,
    });
    expect(headerElement).toBeInTheDocument();
  });

  test('should render Counter', () => {
    const counterElement = screen.getByRole('button', {
      name: /count is/i,
    });
    expect(counterElement).toBeInTheDocument();
  });

  test('should render Footer', () => {
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });
});
```

De esta forma, estarían¡mos haciendo un test de integración del componente App, comprobando que se renderizan correctamente los componentes hijos y que se comportan de la forma esperada. Igualmente podríamos entenderlo como un test de aceptación, ya que estamos comprobando que el componente App cumple con los requisitos funcionales establecidos.

Creamos el test válido en la medida en que conocemos realmente los componentes hijos y su funcionamiento,

- el Header muestra un título concreto en un elemento con rol de heading,
- el Counter muestra un botón con un texto concreto en un elemento con rol de button,
- el Footer muestra un elemento con un rol concreto.

En un entorno real, donde los componentes hijos pueden ser más complejos y tener su propia lógica interna, este tipo de test puede ser más difícil de implementar y mantener.

##### Test de unitario del componente App

La alternativa estrictamente unitaria para App, ya que los otros componentes ya han sido testados por separado, sería hacer un mock de los componentes hijos, para centrarnos exclusivamente en el componente App. Para ello, podemos utilizar la función **vi.mock** de Vitest para simular los componentes hijos y devolver un componente ficticio que no haga nada.

```tsx
// src/components/app.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { App } from './App';
import type { JSX } from 'react';
import { Header } from '../header/header';
import { Counter } from '../counter/counter';
import { Footer } from '../footer/footer';

vi.mock('../header/header', () => ({
  Header: vi.fn((): JSX.Element => <header>Mocked Header</header>),
}));
vi.mock('../counter/counter', () => ({
  Counter: vi.fn((): JSX.Element => <div>Mocked Counter</div>),
}));
vi.mock('../footer/footer', () => ({
  Footer: vi.fn((): JSX.Element => <footer>Mocked Footer</footer>),
}));

describe('App component (unit test)', () => {
  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render mocked Header', () => {
    const headerElement = screen.getByText(/header/i);
    expect(headerElement).toBeInTheDocument();
    expect(Header).toHaveBeenCalled();
  });
  test('should render mocked Counter', () => {
    const counterElement = screen.getByText(/counter/i);
    expect(counterElement).toBeInTheDocument();
    expect(Counter).toHaveBeenCalled();
  });

  test('should render mocked Footer', () => {
    const footerElement = screen.getByText(/footer/i);
    expect(footerElement).toBeInTheDocument();
    expect(Footer).toHaveBeenCalled();
  });
});
```

En realidad la responsabilidad del componente App es invocar a sus hijos, por lo que podríamos simplificar el test, eliminando la simulación del DOM y limitándonos a comprobar que los componentes hijos son invocados correctamente:

```tsx
// src/components/app.test.tsx
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { App } from './App';
import { Header } from '../header/header';
import { Counter } from '../counter/counter';
import { Footer } from '../footer/footer';

vi.mock('../header/header', () => ({
  Header: vi.fn(),
}));
vi.mock('../counter/counter', () => ({
  Counter: vi.fn(),
}));
vi.mock('../footer/footer', () => ({
  Footer: vi.fn(),
}));

describe('App component (minimal unit test)', () => {
  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call Header component', () => {
    expect(Header).toHaveBeenCalled();
  });
  test('should call Counter component', () => {
    expect(Counter).toHaveBeenCalled();
  });

  test('should call Footer component', () => {
    expect(Footer).toHaveBeenCalled();
  });
});
```

### 🧿En resumen ... y el coverage

Hemos convertido la App inicial creada por Vite en un conjunto de componentes de React, cada uno con su propio carpeta:

- App,
- Header
- Counter
- Footer
- Card
- Card fichero y su propio test.

De cada componente se ha creado un test, utilizando la librería Testing Library para facilitar la interacción con el DOM simulado y la simulación de eventos del usuario. En el caso de App, hemos creado tres versiones del test: aceptación, unitario con mocks y unitario minimalista.

```shell
 ✓ src/components/app/App.test.tsx (3 tests) 123ms
   ✓ App component (unit test) (3)
     ✓ should render mocked Header 98ms
     ✓ should render mocked Counter 10ms
     ✓ should render mocked Footer 10ms
 ✓ src/components/app/App.acceptance.test.tsx (3 tests) 528ms
   ✓ App component (acceptance test) (3)
     ✓ should render Header  377ms
     ✓ should render Counter 84ms
     ✓ should render Footer 64ms
 ✓ src/components/app/App.minimal.test.tsx (3 tests) 52ms
   ✓ App component (minimal unit test) (3)
     ✓ should call Header component 42ms
     ✓ should call Counter component 4ms
     ✓ should call Footer component 4ms
 ✓ src/components/header/header.test.tsx (1 test) 127ms
   ✓ Header component (1)
     ✓ should render the title received as prop 123ms
 ✓ src/components/card/card.test.tsx (2 tests) 146ms
   ✓ Card component (2)
     ✓ should render with title and children 127ms
     ✓ should render without title 13ms
 ✓ src/components/counter/counter.test.tsx (4 tests) 612ms
   ✓ Counter component (4)
     ✓ should start with 0 107ms
     ✓ should increase after click the button with click()  301ms
     ✓ should increase after click the button with fireEvent 87ms
     ✓ should increase after click the button with userEvent 112ms
 ✓ src/components/footer/footer.test.tsx (1 test) 148ms
   ✓ Footer component (1)
     ✓ should render correctly 144ms
```

En el conjunto de la aplicación tenemos 14 tests que se ejecutan en menos de 2 segundos, lo cual es un buen resultado. El coverage report nos indica que tenemos un 100% de cobertura en statements, branches, functions y lines.

```shell
 % Coverage report from v8
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |
 app          |     100 |      100 |     100 |     100 |
  App.tsx     |     100 |      100 |     100 |     100 |
 card         |     100 |      100 |     100 |     100 |
  card.tsx    |     100 |      100 |     100 |     100 |
 counter      |     100 |      100 |     100 |     100 |
  counter.tsx |     100 |      100 |     100 |     100 |
 footer       |     100 |      100 |     100 |     100 |
  footer.tsx  |     100 |      100 |     100 |     100 |
 header       |     100 |      100 |     100 |     100 |
  header.tsx  |     100 |      100 |     100 |     100 |
--------------|---------|----------|---------|---------|-------------------
```

## Más test de componentes: nuevo proyecto de React

Para continuar vamos a crear una segunda aplicación con React, aprovechando las facilidades del monorepo creado con npm.

Después de copiar la carpeta demo1 como demo2 se realizarán los siguientes ajustes:

- Fichero README.md
- Package.json: nombre del proyecto
- index.html: título de la página
- eliminar la carpeta coverage si existe
- reubicación de los componentes en la carpeta src/core/components
- components/App.tsx: título de la aplicación
- `npm i` para actualizar las dependencias y el mono-repositorio
- commit al repositorio

### Páginas y rutas

#### 🧿Componente HomePage

Creamos el componente de la página Home. En React no existen páginas como tal, sino que se crean componentes que representan las distintas páginas de la aplicación. En este caso, creamos un componente Home que muestra un título h2.

```tsx
import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <section>
      <h2>Home Page</h2>
    </section>
  );
};
```

Creamos su correspondiente test:

```tsx
import { render, screen } from '@testing-library/react';
import { HomePage } from './home.page';

describe('HomePage', () => {
  test('should render h2 heading', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
```

#### 🧿Componentes NotesPage y AboutPage

Creamos los componentes de la página Notes y su test, cambiando únicamente el contenido de la etiqueta \<h2>.

#### Reubicando el componente Counter

Mientras ejecutamos nuestros tests,

- movemos el componente Counter a la carpeta src/home/components/counter, para utilizarlo en la página Home.
- renderizamos el componente Counter dentro de HomePage.
- en App renderizamos HomePage en lugar de Counter.

Los test de Counter y HomePage siguen funcionando correctamente.

El test de integración de App también funciona correctamente, ya que el componente Counter sigue siendo renderizado dentro de App a través de HomePage.

Los test unitarios de App, que utilizan mocks para simular los componentes hijos, también funcionan correctamente, ya que el componente Counter sigue siendo simulado correctamente. Lo único necesario será actualizar la ruta del mock para que apunte a la nueva ubicación del componente Counter.

Sin embargo, es posible que en la implementación de los test de App no tenga sentido incluir Counter ya que va a depender de la ruta que se utilice en la aplicación. Por tanto, podemos eliminar Counter en todos los test de App.

El problema de la reubicación de Counter es que ahora HomePage depende de Counter, por lo tendremos la situación que veíamos antes con App y sus componentes hijos.

- si queremos testar HomePage de forma aislada, debemos simular Counter en el test de HomePage.
- si queremos que el test sea de integración, debemos renderizar HomePage con Counter incluido. Y en este caso podremos comprobar que el contador funciona correctamente dentro de HomePage.
- si no hacemos nada, el test de HomePage no fallará, y estaremos ignorando el componente Counter.

Vamos a optar por esta última solución.

#### Rutas y navegación

React, como librería para la creación de UI, no tiene ningún soporte para la gestión de las rutas que nos permite construir una SPA. Para ello es frecuente recurrir a alguna librería adicional, entre las que destaca [**React Router**](https://reactrouter.com/) antes conocida como React Router DOM. Esta librería permite definir rutas y navegar entre ellas de forma sencilla.

Para instalar React Router, ejecutamos el siguiente comando:

```shell
npm i react-router
```

En sus versiones 7.x existen tres estrategias de uso:

- Declarativa
- Data (Programática)
- Framework

##### Data (Programática)

Las rutas no se definen de forma declarativa :

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<div>404 Not Found</div>} />
</Routes>
```

En su lugar se crea un array de objetos que representan las rutas

```tsx
import { type RouteObject } from 'react-router';
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      {
        // path: '/',
        index: true,
        Component: HomePage,
      },
      {
        path: '/notes',
        Component: NotesPage,
      },
    ],
  },
];
```

Las rutas se pueden definir de forma anidada, utilizando la propiedad `children`.
El componente por defecto puede indicarse con un `path: '\'` o con la propiedad `index: true`, que indica que es la ruta por defecto del padre.

##### Provider y Rutas

En el fichero main

- Con el array importado de las rutas como parámetro se crea un router

```tsx
const appRouter = createBrowserRouter(routes);
```

- se añade un provider de las rutas

```tsx
<RouterProvider router={appRouter} />
```

El fichero `src/main.tsx` quedaría de la siguiente forma:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './core/routes.ts';

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find the root element');

const appRouter = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>
);
```

El nuevo formato del RouterProvider ya no encapsula ningún componente, sino que recibe un objeto `router` que contiene las rutas definidas.

En el componente App, debemos añadir un contenedor para renderizar las rutas hijas, donde antes habíamos incluido HomePage directamente. Para ello, utilizamos el componente **Outlet** proporcionado por React Router, que renderiza el componente correspondiente a la ruta hija actual.:

```tsx
import { Outlet } from 'react-router-dom';

export const App: React.FC = () => {
  const appTitle = 'React with TS - Demo 2';
  return (
    <>
      <Header title={appTitle} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
```

Con esto tendremos 2 rutas disponibles y ningún efecto sobre nuestros test previos, aunque de momento no estamos testando el funcionamiento de las rutas

El coverage nos lo indicará haciendo referencia al fichero `src/core/routes.ts` con 0 líneas cubiertas:

```shell
-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   91.66 |      100 |     100 |    90.9 |
 core                          |       0 |      100 |     100 |       0 |
  routes.ts                    |       0 |      100 |     100 |       0 | 5
```

#### Test de las rutas

Para testar las rutas, empleamos la función `createMemoryRouter` de React Router, que nos permite crear un router en memoria para simular la navegación a una ruta concreta. De esta forma, podemos renderizar el componente RouterProvider con el router creado y comprobar que se muestra el componente correspondiente a la ruta actual. El procedimiento es similar al test de componentes con rutas `AppRoutes.tsx` que se usaba anteriormente en el modo declarativo y se testaba con la función `MemoryRouter`.

[Nota: más adelante se incluye un ejemplo de este procedimiento en el apartado de test de componentes con rutas (modo antiguo o declarativo).]

La función `createMemoryRouter`, que recibirá como parámetro el array de rutas y un objeto con la ruta activa de cada caso de test y comprobaremos que la página correspondiente, de la que tenemos un mock, ha sido llamada.

```tsx
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { HomePage } from '../pages/home/home-page';
import { NotesPage } from '../pages/notes/notes-page';
import { appRoutes } from './routes';

vi.mock('../pages/home/home-page');
vi.mock('../pages/notes/notes-page');

describe('Routes', () => {
  test('should render info for invalid routes', () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/invalid-route'],
    });
    render(<RouterProvider router={router} />);

    const element = screen.getByText('404 Not Found');
    expect(element).toBeInTheDocument();
  });

  test('should route to home page', async () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);
    expect(HomePage).toHaveBeenCalled();
  });
  test('should route to notes page', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/notes'],
    });
    render(<RouterProvider router={router} />);
    expect(NotesPage).toHaveBeenCalled();
  });
});
```

##### Test de componentes con rutas (modo antiguo o declarativo)

En ocasiones, los componentes de React dependen de la ruta en la que se encuentran, por ejemplo, para mostrar un componente u otro en función de la ruta. Para testar estos componentes, necesitamos simular la navegación a una ruta concreta antes de renderizar el componente. Para ello, Testing Library proporciona la función **MemoryRouter** que nos permite simular la navegación a una ruta concreta.

Vamos a testar el siguiente componente de React:

```tsx
// src/components/app.routes.tsx
import { Route, Routes } from 'react-router-dom';

const Home = () => <p>Estás en la página de inicio</p>;
const About = () => <p>Estás en la página de acerca de</p>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home></Home>}></Route>
      <Route path="/about" element={<About></About>}></Route>
    </Routes>
  );
}
```

Para testar este componente, creamos un fichero Route.test.tsx en el mismo directorio que el componente y escribimos el siguiente código:

```tsx
// src/components/app.routes.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Route from './Route';

test('The routes component render the Home Page', () => {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <AppRoutes />
    </MemoryRouter>
  );
  const textElement = screen.getByText(/página de inicio/i);
  expect(textElement).toBeInTheDocument();
});

test('The routes component render the About Page', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <AppRoutes />
    </MemoryRouter>
  );
  const textElement = screen.getByText(/página de acerca de/i);
  expect(textElement).toBeInTheDocument();
});
```

En estos tests, simulamos la navegación a la ruta /home y /about con la función MemoryRouter y comprobamos que se muestra el texto correspondiente en el DOM simulado. La función **MemoryRouter** recibe una prop **initialEntries** con un array de rutas a las que se navega al renderizar el componente. En este caso, navegamos a las rutas /home y /about antes de renderizar el componente Route.

##### 🧿Componente Menu: navegación

Para utilizar las rutas necesitamos un componente que permita navegar entre ellas. Para ello, creamos un componente Menu que muestra un menú de navegación con enlaces a las distintas rutas de la aplicación.

```tsx
// src/core/components/menu/menu.tsx
import { Link } from 'react-router';

type Props = {
  options: MenuOption[];
};

export const Menu: React.FC<Props> = ({ options }) => {
  return (
    <nav>
      <ul>
        {options.map((option) => (
          <li key={option.path}>
            <Link to={option.path}>{option.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

El componente Menu recibe una prop options que es un array de objetos con la ruta y la etiqueta del enlace. Utiliza el componente Link proporcionado por React Router para crear los enlaces a las distintas rutas. Gracias a este componente, podemos navegar entre las distintas páginas de la aplicación sin que se recargue la página HTML, con lo que conseguimos una experiencia de usuario más fluida en una aplicación de una sola página (SPA o Single Page Application).

##### Test del componente Menu

El test del componente Menu es sencillo, ya que simplemente debemos comprobar que se renderizan correctamente los enlaces a las distintas rutas.

Sin embargo, como utilizamos el componente Link de React Router, debemos renderizar el componente Menu dentro de un Router para que los enlaces funcionen correctamente. En la versión declarativa de React Router, podemos utilizar el componente MemoryRouter para simular un router en memoria. En la nueva versión basada en createBrowserRouter, utilizamos createRoutesStub.

```tsx
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { Menu } from './menu';

const options = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

describe('Menu', () => {
  const Stub = createRoutesStub([
    { path: '/', Component: () => <Menu options={options} /> },
  ]);

  beforeEach(() => {
    render(<Stub initialEntries={['/']} />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should renders correctly', () => {
    options.forEach((option) => {
      const linkElement = screen.getByText(option.label);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', option.path);
    });
  });
});
```

El Stub creado con createRoutesStub renderiza el componente Menu dentro de un router simulado, lo que nos permite comprobar que se renderizan correctamente los enlaces a las distintas rutas.

#### Carga diferida (Lazy loading) de las páginas

Se basa en la existencia en el estándar de JS de la posibilidad de importar **módulos** de forma **asíncrona**, utilizando la función `import()`.

Para implementar el lazy loading en las rutas de React Router, se puede utilizar la función `lazy` de React, que permite cargar componentes de forma diferida. Para facilitar esta operación es conveniente que los componentes que se vayan a cargar de forma diferida estén exportados de forma `default`.

```tsx
const Home = React.lazy(() => import('../../features/home/home'));
const Products = React.lazy(() => import('../../features/products/products'));
const ProductDetail = React.lazy(
  () => import('../../features/products/pages/product-detail')
);
const About = React.lazy(() => import('../../features/about/about'));
```

De esta forma no es necesaria ninguna modificación en el array de rutas.

Una alternativa es usar la propiedad lazy de los objetos de las rutas, que permite definir el componente a cargar de forma diferida:

```tsx
{
  path: '/notes',
  lazy: {
      Component: async () =>
          (await import('../../pages/notes/notes-page')).NotesPage,
  },
  id: 'Notes',
},
```

Por motivos didácticos dejamos un página no lazy (HomePage) y otra lazy (NotesPage). Desde el punto de vista del rendimiento de la aplicación, es recomendable que todas las páginas se carguen de forma diferida.

##### Test de las rutas con carga diferida: waitFor

El único cambio en loa test de las rutas es que se debe usar **waitFor** para esperar a que se resuelva la carga del componente diferido:

```tsx
test('should route to notes page', async () => {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/notes'],
  });
  render(<RouterProvider router={router} />);
  await waitFor(() => {
    expect(NotesPage).toHaveBeenCalled();
  });
});
```

### Formularios

#### Añadiendo una página

Creamos un nuevo componente de React que representa una página User para más adelante incluir un formulario de contacto.

Copiamos el componente de la página Notes y su test, cambiando únicamente el contenido de la etiqueta \<h2>.

En el fichero de rutas, añadimos la nueva ruta /user que renderiza el componente AboutPage.

```tsx
{
  path: '/user',
  lazy: {
    Component: async () =>
      (await import('../../pages/user/user-page')).AboutPage,
  },
  id: 'User',
},
```

En el test de las rutas, añadimos un nuevo test para comprobar que se navega correctamente a la página User.

```tsx
test('should route to user page', async () => {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: ['/user'],
  });
  render(<RouterProvider router={router} />);
  await waitFor(() => {
    expect(AboutPage).toHaveBeenCalled();
  });
});
```

En el componente menu y su test no necesitamos hacer ningún cambio, ya que el menú se genera dinámicamente a partir del array de opciones.

#### Formulario controlado

Los formularios en React pueden ser **controlados** o **no controlados**. En un formulario controlado, los valores de los campos del formulario se almacenan en el estado del componente y se actualizan mediante eventos onChange. En un formulario no controlado, los valores de los campos del formulario se almacenan en el DOM y se acceden mediante referencias (refs).

##### 🧿Componente Formulario de registro

Definimos en primer lugar la entidad Register que representa los datos del formulario de registro:

```ts
export type Register = {
  userName: string;
  email: string;
  passwd: string;
  isOkConditions: boolean;
  turn: string;
  course: string;
};
```

Creamos el componente FormRegistrationC que representa el formulario de registro:

```tsx
import { useState } from 'react';

export function FormRegistrationC() {
  const initialState: Register = {
    userName: '',
    email: '',
    passwd: '',
    isOkConditions: false,
    turn: '',
    course: '',
  };
  const [userData, setUserData] = useState<Register>(initialState);

  const handleSubmit = (ev: React.FormEvent): void => {
    ev.preventDefault();

    registerUser(userData).then(() => {
      setUserData(initialState);
      console.log('Usuario registrado');
    });
  };

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const formControl = ev.target;
    // desestructurar no podría acceder a .checked
    // se accede más adelante gracias a una guarda de tipos
    console.dir(formControl);
    setUserData({
      ...userData,
      [formControl.name]:
        formControl.type === 'checkbox'
          ? formControl.checked
          : formControl.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registro en el curso</h3>
      <p>Ejemplo de 'Controlled Form'</p>

      <div className="group-control">
        <input
          type="text"
          name="userName"
          placeholder="Dime tu nombre"
          aria-label="name"
          required
          value={userData.userName}
          onChange={handleChange}
        />
      </div>

      <div className="group-control">
        <input
          type="email"
          name="email"
          placeholder="Dime tu email"
          aria-label="email"
          required
          value={userData.email}
          onChange={handleChange}
        />
      </div>

      <div className="group-control">
        <input
          type="password"
          name="passwd"
          placeholder="Dime tu password"
          aria-label="password"
          required
          value={userData.passwd}
          onChange={handleChange}
        />
      </div>

      <div className="group-control">
        <input
          type="checkbox"
          name="isOkConditions"
          aria-label="conditions"
          id="is-ok"
          checked={userData.isOkConditions}
          onChange={handleChange}
        />
        <label htmlFor="is-ok">Acepto las condiciones...</label>
      </div>

      <fieldset name="turn">
        <legend>Selecciona un turno</legend>
        <input
          type="radio"
          name="turn"
          aria-label="turn"
          id="turno-m"
          value="M"
          onChange={handleChange}
        />
        <label htmlFor="turno-m">Mañana</label>
        <input
          type="radio"
          name="turn"
          id="turno-t"
          value="T"
          onChange={handleChange}
        />
        <label htmlFor="turno-t">Tarde</label>
        <input
          type="radio"
          name="turn"
          id="turno-n"
          value="N"
          onChange={handleChange}
        />
        <label htmlFor="turno-n">Noche</label>
      </fieldset>

      <label htmlFor="course">Elige un curso</label>
      <select
        name="course"
        aria-label="course"
        id="course"
        value={userData.course}
        onChange={handleChange}
      >
        <option value=""></option>
        <option value="A">Angular</option>
        <option value="R">React</option>
        <option value="N">Node</option>
      </select>

      <button type="submit">Enviar</button>
    </form>
  );
}
```

- el método handleChange actualiza el estado del componente cada vez que se modifica un campo del formulario.
- el método handleSubmit envía los datos del formulario a un servicio y resetea el estado del componente.

Como servicio usamos una simulación de una llamada a una API:

```ts
import type { Register } from '../types/register';

export const registerUser = async (userData: Register): Promise<void> => {
  console.log('Registrando usuario', userData);
};
```

##### Test del formulario de registro

En el test del formulario usamos un mock del servicio de registro para evitar realizar llamadas reales a una API cuando más adelante lo implementemos. Utilizamos la función **vi.spyOn** de Vitest para espiar el método registerUser y simular su comportamiento.

En este caso el mock simplemente devuelve una promesa resuelta sin ningún valor, por lo que no tenemos que preocuparnos de que sea asíncrono

```tsx
import { registerUser } from '../../services/user-service';

vi.mock('../../services/user-service', () => ({
  registerUser: vi.fn(async () => undefined),
}));

// ...

expect(registerUser).toHaveBeenCalledWith(userData);
```

En el test, simulamos la interacción del usuario con el formulario utilizando la librería **userEvent** de Testing Library. Esta librería nos permite simular eventos del usuario de forma más realista que la función **fireEvent**.

En este formulario vemos el uso de distintos tipos de controles: input de texto, email y password, checkbox, radio y select. Para cada uno de ellos utilizamos el método correspondiente de userEvent para simular la interacción del usuario.

```tsx
const dataMock: Register = {
  userName: 'Pepe Pérez',
  email: 'pepe@example.com',
  passwd: '12345',
  isOkConditions: true,
  turn: 'M',
  course: 'R',
};

describe('FormRegistrationC', () => {
  beforeEach(() => {
    render(<FormRegistrationC />);
  });

  test('should render correctly', () => {
    const heading = screen.getByRole('heading', {
      name: /registro en el curso/i,
    });
    expect(heading).toBeInTheDocument();
  });

  test('should submit form with correct data', async () => {
    vi.spyOn(console, 'dir').mockImplementation(() => undefined);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const userNameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwdInput = screen.getByLabelText(/password/i);
    const isOkConditionsInput = screen.getByRole('checkbox', {
      name: /conditions/i,
    });
    const turnInput = screen.getByRole('radio', { name: /turn/i });
    const courseInput = screen.getByRole('combobox', { name: /course/i });

    await userEvent.type(userNameInput, dataMock.userName);
    await userEvent.type(emailInput, dataMock.email);
    await userEvent.type(passwdInput, dataMock.passwd);
    await userEvent.click(isOkConditionsInput);
    await userEvent.click(turnInput);
    await userEvent.selectOptions(courseInput, dataMock.course);

    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(registerUser).toHaveBeenCalledWith(dataMock);

    expect(console.log).toHaveBeenCalledWith('Usuario registrado');
  });
});
```

Si el formulario no fuera controlado, el test podría ser el mismo, ya que la interacción del usuario con el formulario es independiente de si el formulario es controlado o no.

### Test de componentes asíncronos

En ocasiones, los componentes de React realizan operaciones asíncronas, como por ejemplo, obtener datos de un servidor. Para testar estos componentes, necesitamos esperar a que se resuelva la operación asíncrona antes de comprobar el resultado. Para ello, Testing Library proporciona la función **waitFor** que nos permite esperar a que se resuelva una operación asíncrona.

Vamos a testar un componente de React que:

- recoge datos de un formulario
- realiza una llamada asíncrona a un servicio externo
- actualiza su estado con los datos obtenidos

Para ello, empezaremos por añadir un servicio que simula la llamada a una API para hacer un login:

```ts
// src/services/user-service.ts
import { Login } from '../types/user';
export const loginUser = (loginData: Login): Promise<User> => {
  console.log('Iniciando sesión', loginData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular respuesta del servidor
      if (
        loginData.email === 'pepe@example.com' &&
        loginData.passwd === '12345'
      ) {
        console.log('Inicio de sesión exitoso');
        resolve({
          id: 1,
          name: 'Pepe Pérez',
          email: loginData.email,
        });
      } else {
        console.log('Credenciales inválidas');
        reject(new Error('Credenciales inválidas'));
      }
    }, 1000);
  });
};
```

#### 🧿Componente LoggedUser

A continuación crearemos el componente LoggedUser que utiliza este servicio para iniciar sesión. De momento un botón nos proporciona los datos de un usuario válido, donde deberemos más adelante añadir un formulario de login.

```tsx
// src/components/logged-user.tsx
const loggedUser: Login = {
  email: 'pepe@example.com',
  passwd: '123456',
};

export const LoggedUser: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const manageStates = async (loginData: Login): Promise<void> => {
    setLoading(true);
    try {
      const user = await loginUser(loginData);
      setUser(user);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <button onClick={() => manageStates(loggedUser)}>Iniciar sesión</button>

      {/* En lugar del botón, añadir el componente 
            con el formulario de login aquí */}

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <h4>Usuario activo:</h4>
          <p>Id: {user.id}</p>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </Card>
  );
};
```

Para testar este componente, creamos un fichero logged-user.test.tsx en el mismo directorio que el componente y escribimos el siguiente código:

```tsx
// src/components/logged-user.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoggedUser } from './logged-user';

describe('LoggedUser component', () => {
  beforeEach(() => {
    render(<LoggedUser />);
  });

  test('The component render the obtained data (with waitFor)', async () => {
    const buttonElement = screen.getByText(/Iniciar sesión/i);
    await userEvent.click(buttonElement);

    let textElement = screen.getByText(/cargando/i);
    expect(textElement).toBeInTheDocument();

    await waitFor(async () => {
      textElement = screen.getByText(/usuario activo/i);
      expect(textElement).toBeInTheDocument();
    });
  });
});
```

Lo primero que vemos en este test es que tendríamos que crear un mock del servicio responsable de la llamada a la API mediante fetch. Para ello, podemos utilizar la función **vi.mock** de Jest para simular la llamada a la API y devolver los datos que esperamos. Como en este momento el servicio es solo una simulación, podemos usarlo directamente sin necesidad de un mock.

En este test, simulamos un clic en el botón "Obtener datos" con la función userEvent.click y esperamos que aparezca el texto "Cargando..." en el DOM simulado. A continuación, esperamos a que se resuelva la operación asíncrona con la función waitFor. La función waitFor recibe una función que se ejecuta de forma asíncrona y espera a que se resuelva antes de continuar con el test. En este caso, esperamos a que se muestre el texto "sample data" en el DOM simulado.

Los distintos métodos de Testing Library para obtener elementos del DOM simulado, facilitan los test asíncronos sin que sea necesario usar waitFor. Así el test anterior podría reescribirse de la siguiente forma:

```tsx
// src/components/logged-user.test.tsx
test('The component render the obtained data', async () => {
  const buttonElement = screen.getByText(/Iniciar sesión/i);
  await userEvent.click(buttonElement);
  let textElement = screen.getByText(/cargando/i);
  expect(textElement).toBeInTheDocument();
  textElement = await screen.findByText(/usuario activo/i);

  expect(textElement).toBeInTheDocument();
});
```

En cualquiera de ambas versiones, el mismo código, sin el evento del botón, serviría para testar la carga inicial de los datos, llamando al método fetchData desde un useEffect.

---

<p style="color: red;"> Desde aquí si revisar</p>

---

Pendiente: añadir el formulario de login y su test.
Modificar el componente LoggedUser para utilizar el formulario de login en lugar del botón.
Modificar el test de LoggedUser para ignorar el formulario de login (= seguir como cuando teníamos el botón).

### Test de componentes de React con context

En ocasiones, los componentes de React dependen de un contexto que proporciona valores a lo largo del árbol de componentes. Para testar estos componentes, necesitamos renderizar el componente con el contexto correspondiente y comprobar que se comporta de la forma esperada. Para ello, Testing Library proporciona la función **render** que nos permite renderizar el componente con el contexto correspondiente.

El tipo del contexto se define como una interfaz que describe la forma del objeto que se va a compartir. En este caso, el contexto es un servicio de usuario.

```tsx
export type AppContextType = {
  user: UseLogged | null;
  theme: Theme;
  language: Language;
};
```

El contexto, como objeto que puede ser accedido desde cualquier parte de la aplicación se crea con la función `createContext`, que recibe como parámetro el valor por defecto del contexto. Este valor se usará si no hay un proveedor (Provider) en la jerarquía de componentes.

```tsx
export const AppContext = createContext<AppContextType>({
  user: null,
  theme: 'light',
  language: 'en',
});
```

El proveedor (Provider) es un componente que envuelve a los componentes que necesitan acceder al contexto. Este componente recibe como prop el valor del contexto y lo proporciona a todos los componentes hijos.

```tsx
export const ContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const contextValue: AppContextType = {
    user: useLogged(),
    theme: 'light',
    language: 'en',
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
```

Lo habitual es que el contexto y el provider se implementen en ficheros separados. En caso contrario habrá que desactivar la regla de eslint `react-refresh/only-export-components`

#### Acceso al contexto

Para que el contexto sea accesible de debe hacer uso del `Provider` en el árbol de componentes, envolviendo los componentes que necesitan acceder al contexto. Si toda la aplicación tiene que tener acceso al contexto, esto se hace en el fichero main.tsx, donde se renderiza el componente raíz de la aplicación.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { appRoutes } from './core/routes/routes.ts';
import { AppContextProvider } from './core/context/provider.tsx';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find the root element');

const appRouter = createBrowserRouter(appRoutes);

createRoot(root).render(
  <StrictMode>
    <AppContextProvider>
      <RouterProvider router={appRouter} />
    </AppContextProvider>
  </StrictMode>
);
```

Vamos a testar el siguiente componente que consume el contexto:

```tsx
// src/components/sample.with.context.tsx
import { useContext } from 'react';
import { AppContext } from './context';

function SampleWithContext() {
  const { user } = useContext(AppContext);
  return <p>{user ? user.name : 'No user logged in'}</p>;
}
```

Para testar este componente, creamos un fichero Context.test.tsx en el mismo directorio que el componente y escribimos el siguiente código:

```tsx
// src/components/app.context.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppContext } from './context';
import { SampleWithContext } from './sample.with.context';

function ContextProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

test('The component render the value provide by the context', () => {
  render(
    <ContextProvider value="Valor de prueba">
      <SampleWithContext />
    </ContextProvider>
  );
  const textElement = screen.getByText(/Valor de prueba/i);
  expect(textElement).toBeInTheDocument();
});
```

## Pruebas instantáneas: Snapshots

Las pruebas de instantáneas (snapshot tests) son una característica de Jest que te permite capturar la salida renderizada de una parte de
tu aplicación y guardarla en un archivo de instantánea. Esto es especialmente útil para pruebas de componentes de UI, ya que
puedes comparar la representación renderizada actual con una instantánea previamente guardada para detectar cualquier cambio
inesperado.

### ¿Cómo Funcionan las Pruebas de Instantáneas?

1. Crear la instantánea: Cuando ejecutas la prueba por primera vez, Jest renderiza el componente y guarda la salida en un archivo
   de instantánea.
2. Comparar con la instantánea: En futuras ejecuciones, Jest compara la salida actual del componente con la instantánea
   guardada.
3. Actualizar la instantánea: Si la representación del componente cambia (y el cambio es intencional), puedes actualizar la
   instantánea para reflejar la nueva salida.

### Paso a Paso: Creando una Prueba de Instantánea

Paso 1: Configurar el Componente
Supongamos que tienes un componente React llamado Button . Este componente simplemente muestra un botón con una etiqueta.

```tsx
// button.tsx
export function Button({ label }) {
  return <button>{label}</button>;
}
```

<!--

Paso 2: Instalar Dependencias Necesarias

Para crear una prueba de instantánea, necesitas instalar react-test-renderer , una biblioteca que permite renderizar componentes
React en pruebas de instantáneas.

```sh
npm install react-test-renderer
```

-->

Paso 2: Crear la Prueba de Instantánea

Ahora, crea un archivo de prueba para el componente Button.

```tsx
// button.test.tsx

import renderer from 'react-test-renderer';
import Button from './Button';

test('Button component is rendered correctly', () => {
  const tree = renderer.create(<Button label="Click me" />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

`renderer.create(<Button label="Click me" />).toJSON()`: Esta línea renderiza el componente Button con la etiqueta
"Click me" y lo convierte a un formato JSON que puede ser almacenado en una instantánea.
`expect(tree).toMatchSnapshot()`: Esta línea compara la representación renderizada actual del componente con la
instantánea guardada. Si no hay una instantánea existente, Jest creará una nueva. Si ya existe una, Jest comparará la salida
actual con la instantánea y fallará si hay diferencias inesperadas.

Paso 3: Ejecutar la Prueba

Cuando ejecutes npm test por primera vez, Jest creará un archivo de instantánea en una carpeta **snapshots** . Este archivo
almacenará la representación renderizada del componente Button.

Actualizar la Instantánea

Si haces cambios en el componente y estos cambios son intencionales, puedes actualizar la instantánea. Para hacerlo, ejecuta Jest
con la opción -u o --updateSnapshot:

```sh
npm test -- -u
```

Beneficios de las Pruebas de Instantáneas

- Detección de Cambios Inesperados: Las pruebas de instantáneas te alertan sobre cualquier cambio inesperado en la salida de
  tu componente, ayudándote a mantener la integridad de la UI.
- Fácil de Mantener: Es fácil actualizar las instantáneas cuando realizas cambios intencionales en tu componente.
- Documentación Visual: Las instantáneas actúan como una forma de documentación visual, mostrando cómo se debe ver la
  salida de un componente en diferentes estados.

Consideraciones

- Se pueden considerar como **pruebas de regresión visual**, ya que detectan cambios en la representación visual de un componente. Solo tienen sentido en el momento en que los componentes son funcionales y estables.
- Es importante su **granularidad**: Asegúrate de que tus instantáneas no sean demasiado grandes. Captura instantáneas de partes pequeñas y
  específicas de tu UI para que las comparaciones sean manejables y significativas.
- Hay que **revisar siempre los cambios** en las instantáneas antes de actualizarlas para asegurarte de que los cambios
  son intencionales y correctos.
