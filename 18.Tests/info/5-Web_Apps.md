# Testing de aplicaciones web. Tests en el frontend

## Entorno y herramientas

### Proyecto React creado con Vite

De las diversas formas con las que podemos crear un proyecto que utilice React,una de las más habituales actualmente, después de qye Create React App haya quedado descontinuado, es con Vite.

Vite es un entorno de desarrollo que permite crear aplicaciones web modernas con React, Vue, Svelte y Vanilla JavaScript. Vite proporciona un entorno de desarrollo rápido y eficiente, con recarga en caliente y construcción rápida, gracias a su arquitectura basada en ESM (ECMAScript Modules). Para crear un proyecto con Vite y React, ejecutamos el siguiente comando:

```sh
npm create vite@latest my-react-app --template react
```

En el proyecto debemos añadir Jest y configurarlo de forma un poco diferente a como explicamos en la unidad correspondiente al backend.

#### Configuración de Jest en un proyecto Vite

Para configurar Jest en un proyecto Vite, necesitamos instalar las siguientes dependencias:

```sh
npm install -D jest
npm install -D @babel/preset-env @babel/preset-react
npm install -D jest-svg-transformer identity-obj-proxy
```

Los paquetes de babel dan soporte a uso de ESM y JSX por parte de Jest.
Los paquetes de jest-svg-transformer e identity-obj-proxy son necesarios para que Jest pueda interpretar las importaciones de archivos SVG y archivos CSS, propias de Vite.

Para configurar el uso de estas dependencias, podemos crear ficheros específicos de configuración de Babel y Jest, o añadir las configuraciones necesarias en el fichero package.json.

```json
{
  "babel": {
    "presets": [
      "@babel/preset-env",
      [
        "@babel/preset-react",
        {
          "runtime": "automatic"
        }
      ]
    ]
  },
  "jest": {
    "testEnvironment": "jsdom",
    "moduleNameMapper": {
      "^.+\\.svg$": "jest-svg-transformer",
      "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    }
  }
}
```

Como Vite incluye la instalación y configuración de ESLint, debemos añadir un modificador para usar Jest en su configuración, que en este caso se encuentra en el fichero .eslintrc.cjs.

```js
   env: { browser: true, es2020: true, jest: true },
```

### testing library

Cuando creamos una aplicación web del lado cliente (frontend) esta se ejecuta en un navegador web. Por lo tanto, para probarla necesitamos un entorno de pruebas que simule un navegador y nos permita interactuar con la aplicación como lo haría un usuario real. En principio, las pruebas que realiza Jest no aportan esta funcionalidad, ya que Jest es un entorno de pruebas para Node.js y no simula un navegador. Para conseguirlo debemos instalar una librería adicional que nos permita realizar pruebas en un entorno de navegador simulado.

```sh
npm i -D jest-environment-jsdom
```

A continuación modificaremos la configuración de Jest para que utilice jsdom como entorno de pruebas, añadiendo un nuevo valor en el fichero jest.config.js

```js
testEnvironment: 'jsdom',
```

Con esto podemos ejecutar pruebas que interactúen con el DOM de la página, como por ejemplo comprobar que un elemento se muestra o se oculta correctamente. Sin embargo, Jest no proporciona una forma sencilla acceder a los elementos del DOM simulado ni de simular la interacción del usuario con la página, como hacer clic en un botón o rellenar un formulario. Existen varias librería adicionales que facilitan gestionar el DOM y simular la interacción del usuario con la página, como por ejemplo [Enzyme](https://enzymejs.github.io/enzyme/) o [Testing Library](https://testing-library.com/) que es la que usaremos nosotros.

Testing Library es en realidad una colección de librerías que nos permiten realizar de forma sencilla y eficaz, pruebas de aplicaciones en vanilla JavaScript y de componentes de frameworks como React, Angular, Vue, Svelte, etc.

En el caso de vanilla JavaScript, Testing Library proporciona la librería @testing-library/dom, que nos permite interactuar con el DOM de la página de forma sencilla y eficaz. Para instalarla ejecutamos el siguiente comando:

```sh
npm i -D @testing-library/dom @testing-library/jest-dom testing-library/user-event
```

La segunda librería que vamos a instalar es @testing-library/jest-dom, que proporciona matchers adicionales para Jest con el fin de realizar comprobaciones sobre el DOM de la página. Por último, la librería testing-library/user-event nos facilita simular la interacción del usuario con la página, como hacer clic en un botón o rellenar un formulario, enfocándose siempre en la perspectiva del usuario.

En nuestro caso, para testar los componentes de React, vamos a utilizar la librería @testing-library/react junto con las otras mencionadas anteriormente. Para instalarla ejecutamos el siguiente comando:

```sh
npm i -D @testing-library/react @testing-library/jest-dom testing-library/user-event
```

## Test de componentes (integración)

Los test de los componentes suelen considerarse **test de integración**, ya que implican un componente con su interfaz gráfica y su lógica y muchas veces incluyen además la interacción con otros componentes incluidos en el que estamos testando. En este tipo, gracias a la Testing Library, lo primero que debemos hacer es **renderizar** el componente, junto con sus "hijos", en un contenedor del DOM simulado. A continuación, podemos **interactuar** con el componente y comprobar que se comporta de la forma esperada.

Vamos a testar el siguiente componente de React, aunque el proceso es similar para cualquier otro tipo de componente:

```js
// src/components/sample.jsx

export function Sample() {
  const title = "Ejemplo de un componente";
  return (
    <div>
      <p>{title}</p>
    </div>
  );
}
```

Para testar este componente, creamos un fichero Sample.test.js en el mismo directorio que el componente y escribimos el siguiente código:

```js
// src/components/sample.test.jsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sample from "./sample";

test("The componente is rendered in the screen", () => {
  render(<Sample />);
  const textElement = screen.getByText(/Ejemplo de un componente/i);
  expect(textElement).toBeInTheDocument();
});
```

Como se puede ver usamos varios elementos de Testing Library para testar el componente:

- La **función render** permite renderizar el componente Counter en el DOM simulado.
- El **objeto screen** proporciona funciones para obtener elementos del DOM simulado, como getByText que obtiene un elemento que contenga un texto determinado.

En el test, comprobamos que el elemento correspondiente al componente está en el DOM simulado. Disponemos para ello de uno de los **matchers** mas utilizados entre los que aporta la librería con la función expect(textElement).**toBeInTheDocument()**.

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

## Test de un componente de React

### Estado e Interacciones del usuario

Los componentes de React suelen tener un **estado interno**, creado gracias al hook `useState` que puede cambiar en función de la interacción del usuario con el componente. Para testar estos componentes, necesitamos simular la interacción del usuario con el componente, como hacer clic en un botón o rellenar un formulario. Para ello, Testing Library proporciona la función **fireEvent** que nos permite simular eventos del usuario, como hacer clic en un botón o rellenar un formulario.

Vamos a testar el siguiente componente de React:

```js
// src/components/counter.js
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>Haz clic</button>
    </div>
  );
}
```

Para testar este componente, creamos un fichero Counter.test.js en el mismo directorio que el componente y escribimos el siguiente código:

```js
// src/components/counter.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Counter from "./counter";

test("The counter start with 0", () => {
  render(<Counter />);
  const textElement = screen.getByText(/Has hecho clic 0 veces/i);
  expect(textElement).toBeInTheDocument();
});

test("The counter increase after click the button", () => {
  render(<Counter />);
  const buttonElement = screen.getByText(/Haz clic/i);
  fireEvent.click(buttonElement);
  const textElement = screen.getByText(/Has hecho clic 1 veces/i);
  expect(textElement).toBeInTheDocument();
});
```

En el primer test, sin haber hecho clic comprobamos que el elemento correspondiente al componente está en el DOM simulado. Como ya hemos visto, para ello utilizamos los dos elementos básicos de Testing Library, la función render y el objeto screen, junto con el matcher toBeInTheDocument. la librería con la función expect(textElement).toBeInTheDocument(). Al mismo tiempo estamos testando que el contador se inicializa a 0, al comprobar como este valor se refleja en la vista renderizada por el componente. Vemos pòr tanto el carácter de test de 'caja negra' de este tipo de test.

En el segundo test, simulamos un clic en el botón Haz clic con la función fireEvent.click y comprobamos que el texto Has hecho clic 1 veces está en el DOM simulado, es decir que a traves de la vista comprobamos como ha cambiado el estado interno del componente. El objeto fireEvent proporciona una serie de métodos para simular eventos del usuario, como hacer clic en un botón o rellenar un formulario.

La propia testing library proporciona una segunda librería, **testing-library/user-event**, que incluye una serie de métodos para simular eventos, como hacer clic en un botón o rellenar un formulario de una forma mas realista, como si un usuario real estuviera interactuando con la página.

Por ejemplo, userEvent.type simula la escritura de un texto en un campo de texto, mientras que fireEvent.change simula el evento de cambio de un campo de texto.

El test resultante quedaría como sigue:

```js
// src/components/counter.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Counter from "./Counter";

test("The counter start with 0", () => {
  render(<Counter />);
  const textElement = screen.getByText(/Has hecho clic 0 veces/i);
  expect(textElement).toBeInTheDocument();
});

test("The counter increase after click the button", async () => {
  render(<Counter />);
  const buttonElement = screen.getByText(/Haz clic/i);
  await userEvent.click(buttonElement);
  const textElement = screen.getByText(/Has hecho clic 1 veces/i);
  expect(textElement).toBeInTheDocument();
});
```

En userEvent, los eventos son **asíncronos**, por lo que debemos esperar a que se resuelva la operación antes de comprobar el resultado. Para ello, la función es **async** y utilizamos la palabra clave **await** antes de userEvent.click.

### Test de componentes asíncronos

En ocasiones, los componentes de React realizan operaciones asíncronas, como por ejemplo, obtener datos de un servidor. Para testar estos componentes, necesitamos esperar a que se resuelva la operación asíncrona antes de comprobar el resultado. Para ello, Testing Library proporciona la función **waitFor** que nos permite esperar a que se resuelva una operación asíncrona.

Vamos a testar el siguiente componente de React:

```js
// src/components/async.js
import { useState } from "react";

export function Async() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    const json = await response.json();
    setData(json);
  };

  return (
    <div>
      <button onClick={fetchData}>Obtener datos</button>
      {data && <p>{data.title}</p>}
    </div>
  );
}
```

Para testar este componente, creamos un fichero Async.test.js en el mismo directorio que el componente y escribimos el siguiente código:

```js
// src/components/Async.test.js
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Async from "./async";

test("The component render the obtained data", async () => {
  render(<Async />);
  const buttonElement = screen.getByText(/Obtener datos/i);
  userEvent.click(buttonElement);
  await waitFor(() => {
    const textElement = screen.getByText(/sample data/i);
    expect(textElement).toBeInTheDocument();
  });
});
```

Lo primero que vemos en este test es que tenemos que crear un mock de la llamada a la API mediante fetch. Para ello, podemos utilizar la función **jest.mock** de Jest para simular la llamada a la API y devolver los datos que esperamos.

En este test, simulamos un clic en el botón "Obtener datos" con la función userEvent.click y esperamos a que se resuelva la operación asíncrona con la función waitFor. La función waitFor recibe una función que se ejecuta de forma asíncrona y espera a que se resuelva antes de continuar con el test. En este caso, esperamos a que se muestre el texto "sample data" en el DOM simulado.

Los distintos métodos de Testing Library para obtener elementos del DOM simulado, facilitan los test asíncronos sin que sea necesario usar waitFor. Así el test anterior podría reescribirse de la siguiente forma:

```js
// src/components/Async.test.js
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Async from "./async";

test("The component render the obtained data", async () => {
  render(<Async />);
  const buttonElement = screen.getByText(/Obtener datos/i);
  userEvent.click(buttonElement);
  const textElement = await screen.findByText(/sample data/i);
  expect(textElement).toBeInTheDocument();
});
```

En cualquiera de ambas versiones, el mismo código, sin el evento del botón, serviría para testar la carga inicial de los datos, llamando al método fetchData desde un useEffect.

### Test de componentes con rutas

React, como librería para la creación de UI, no tiene ningún soporte para la gestión de las rutas que nos permite construir una SPA. Para ello es frecuente recurrir a alguna librería adicional, entre las que destaca [**React Router**](https://reactrouter.com/en/main). Para instalarla ejecutamos el siguiente comando:

```sh
npm install react-router-dom
```

En ocasiones, los componentes de React dependen de la ruta en la que se encuentran, por ejemplo, para mostrar un componente u otro en función de la ruta. Para testar estos componentes, necesitamos simular la navegación a una ruta concreta antes de renderizar el componente. Para ello, Testing Library proporciona la función **MemoryRouter** que nos permite simular la navegación a una ruta concreta.

Vamos a testar el siguiente componente de React:

```js
// src/components/app.routes.js
import { Route, Routes } from "react-router-dom";

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

Para testar este componente, creamos un fichero Route.test.js en el mismo directorio que el componente y escribimos el siguiente código:

```js
// src/components/app.routes.test.js

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Route from "./Route";

test("The routes component render the Home Page", () => {
  render(
    <MemoryRouter initialEntries={["/home"]}>
      <AppRoutes />
    </MemoryRouter>
  );
  const textElement = screen.getByText(/página de inicio/i);
  expect(textElement).toBeInTheDocument();
});

test("The routes component render the About Page", () => {
  render(
    <MemoryRouter initialEntries={["/about"]}>
      <AppRoutes />
    </MemoryRouter>
  );
  const textElement = screen.getByText(/página de acerca de/i);
  expect(textElement).toBeInTheDocument();
});
```

En estos tests, simulamos la navegación a la ruta /home y /about con la función MemoryRouter y comprobamos que se muestra el texto correspondiente en el DOM simulado. La función **MemoryRouter** recibe una prop **initialEntries** con un array de rutas a las que se navega al renderizar el componente. En este caso, navegamos a las rutas /home y /about antes de renderizar el componente Route.

## Test de componentes de React con props

En ocasiones, los componentes de React reciben props que afectan a su comportamiento o a su apariencia. Para testar estos componentes, necesitamos renderizar el componente con las props correspondientes y comprobar que se comporta de la forma esperada. Para ello, Testing Library proporciona la función **render** que nos permite renderizar el componente con las props correspondientes.

Vamos a testar el siguiente componente de React:

```js
// src/components/props.js

function Props({ text }) {
  return <p>{text}</p>;
}
```

Para testar este componente, creamos un fichero Props.test.js en el mismo directorio que el componente y escribimos el siguiente código:

```js
// src/components/props.test.js
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Props from "./props";

test("The props value is rendered in the screen", () => {
  render(<Props text="Texto de prueba" />);
  const textElement = screen.getByText(/Texto de prueba/i);
  expect(textElement).toBeInTheDocument();
});
```

En este test, renderizamos el componente Props con la prop text="Texto de prueba" y comprobamos que se muestra el texto correspondiente en el DOM simulado. La función render recibe el componente Props con la prop text="Texto de prueba" y renderiza el componente en el DOM simulado.

## Test de componentes de React con context

En ocasiones, los componentes de React dependen de un contexto que proporciona valores a lo largo del árbol de componentes. Para testar estos componentes, necesitamos renderizar el componente con el contexto correspondiente y comprobar que se comporta de la forma esperada. Para ello, Testing Library proporciona la función **render** que nos permite renderizar el componente con el contexto correspondiente.

Vamos a testar el siguiente componente de React:

```js
// src/components/app.context.js
import { createContext, useContext } from "react";

const Context = createContext();

function ContextProvider({ value, children }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

// ContextConsumer
function AppContext() {
  const value = useContext(Context);
  return <p>{value}</p>;
}
```

Para testar este componente, creamos un fichero Context.test.js en el mismo directorio que el componente y escribimos el siguiente código:

```js
// src/components/app.context.test.js
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContextProvider } from "./app.context";
import { ContextConsumer } from "./app.context";

test("The component render the value provide by the context", () => {
  render(
    <ContextProvider value="Valor de prueba">
      <ContextConsumer />
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

```js
// button.js
export function Button({ label }) {
  return <button>{label}</button>;
}
```

Paso 2: Instalar Dependencias Necesarias

Para crear una prueba de instantánea, necesitas instalar react-test-renderer , una biblioteca que permite renderizar componentes
React en pruebas de instantáneas.

```sh
npm install react-test-renderer
```

Paso 3: Crear la Prueba de Instantánea

Ahora, crea un archivo de prueba para el componente Button.

```js
// button.test.js

import renderer from "react-test-renderer";
import Button from "./Button";

test("Button component is rendered correctly", () => {
  const tree = renderer.create(<Button label="Click me" />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

`renderer.create(<Button label="Click me" />).toJSON()`: Esta línea renderiza el componente Button con la etiqueta
"Click me" y lo convierte a un formato JSON que puede ser almacenado en una instantánea.
`expect(tree).toMatchSnapshot()`: Esta línea compara la representación renderizada actual del componente con la
instantánea guardada. Si no hay una instantánea existente, Jest creará una nueva. Si ya existe una, Jest comparará la salida
actual con la instantánea y fallará si hay diferencias inesperadas.

Paso 4: Ejecutar la Prueba

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

## Ejercicios

En el módulo 4, hiciste una serie de ejercicios básicos con React

- Crear un componente React simple que represente una tarjeta de presentación.
- Formulario de login básico
- Componente semáforo

Ahora puedes crear los test unitarios para estos componentes con Jest y React Testing Library.

En ese mismo módulo, también hiciste una serie de ejercicios más avanzados con React

- Adopta un amigo peludo: listado, filtro y detalle de mascotas, formulario de solicitud
- Reto Fitness: formulario en multiples componentes para la inscripción a un gimnasio.

Puedes utilizar nuevamente Jest y React Testing Library para crear los test unitarios para todos los componentes que usaste para construir cada uno de estos dos proyectos.

## Referencias

VIDEO: [TESTING en REACT](https://www.youtube.com/watch?v=KYjjtRgg_H0) por Midudev
VIDEO: [Testing Components en React con Jest paso a paso](https://www.youtube.com/watch?v=FjJu3hcPSCY) por Garaje de ideas

- [Testing Library](https://testing-library.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Router](https://reactrouter.com/en/main)
- [Probando aplicaciones React con Jest](https://github.com/fullstack-hy2020/fullstack-hy2020.github.io/blob/02d8be28b1c9190f48976fbbd2435b63261282df/src/content/5/es/part5c.md) from University of Helsinki
- [How to setup Jest and React Testing Library in Vite project](https://zaferayan.medium.com/how-to-setup-jest-and-react-testing-library-in-vite-project-2600f2d04bdd) by Zafer Ayan (2023)
- [How to Test React Components: the Complete Guide](https://www.freecodecamp.org/news/testing-react-hooks/) by Mohammad Iqbal (2019)
