# Test unitarios con Jest

## Introducción. Usos de Jest

En esta unidad nos centraremos en los **test unitarios**, que son como hemos visto, pruebas que se realizan sobre unidades de código, como funciones o clases, de forma aislada. Los test unitarios nos permiten verificar que cada unidad de código funciona correctamente de forma independiente.

De las distintas herramientas de testing ya mencionadas, vamos a utilizar **Jest**, un framework de testing desarrollado por Facebook que nos permite escribir y ejecutar test unitarios tanto para el **backend** desarrollado con Node como para el **frontend**, basado en VanillaJS o en React. Como framework de testing, Jest nos proporciona una serie de utilidades que nos permiten escribir y ejecutar test unitarios de forma sencilla y eficiente, incluyendo herramientas para la creación de **mocks** y **spies**, la realización de pruebas asíncronas basadas en **promesas** y **async/await** o que utilizan **timers**, y la creación y ejecución de pruebas de **snapshot**, etc.

Además de su uso en pruebas unitarias, Jest puede combinarse con otras herramientas para realizar pruebas de integración, pruebas de componentes, pruebas de aceptación.

- junto con [SuperTest](https://www.npmjs.com/package/supertest) permite realizar **pruebas end-to-end de API** desarrolladas en Node.
- junto con [Testing Library](https://testing-library.com/) permite realizar **pruebas de componentes** en aplicaciones web con VanillaJS o con diversos Frameworks, incluyendo **React**.

Otras posibilidades que recoge la propia documentación de Jest, son utilizarlo junto con [Puppeteer](https://pptr.dev/) para realizar **pruebas de navegación (end-to-end)** en aplicaciones web o emplearlo para llevar a cabo pruebas de bases de datos No-SQL como [MongoDB](https://www.mongodb.com/) y [DynamoDB](https://aws.amazon.com/es/dynamodb/).

## Instalación y configuración de Jest

Partimos de la base de que ya tenemos instalado NodeJS y NPM en nuestro sistema. Si no es así, puedes seguir las instrucciones de la [documentación oficial de NodeJS](https://nodejs.org/es/download/). Puedes comprobar la correcta instalación de NodeJS y NPM ejecutando los siguientes comandos en la terminal:

```sh
node -v
npm -v
```

Igualmente vamos a partir de la base de que ya tenemos un proyecto en el que vamos a instalar Jest. Si no es así, puedes crear un proyecto nuevo con el siguiente comando:

```sh
npm init -y
```

Si nuestro proyecto va a utilizar ESModules, debemos añadir la siguiente configuración en el archivo `package.json`:

```json
{
  "type": "module"
}
```

Para instalar Jest en el proyecto, lo primero que debemos hacer es añadirlo como dependencia de desarrollo, ejecutando el siguiente comando en la terminal:

```sh
npm install -D jest @types/jest
```

Al añadir los tipos de Jest, que necesitaríamos para escribir los test unitarios en TypeScript, le damos a VSC la información necesaria para que nos muestre los matchers de Jest en el autocompletado.

En algunos casos, además de haber instalado @types/jest, es necesario configurar el fichero jsconfig.json

```json
{
  "typeAcquisition": {
    "include": ["jest"]
  }
}
```

### Configuración. Uso de módulos ES

Jest no soporta **módulos ES**, por lo que no podemos escribir nuestros test unitarios importando en ese formato las funciones o clases que queremos testar.
La alternativa propuesta por la documentación de Jest es hacer algunos cambios en la configuración del proyecto para que Jest pueda interpretar los módulos ES, pero ello conlleva ciertas limitaciones a la hora de crear mocks de los módulos.

Otra alternativa es utilizar un **transpilador** como **Babel**, que convierta los módulos ES a CommonJS. En general esto supondría instalar el paquete `@babel/core` y el preset `@babel/preset-env` como dependencias de desarrollo, pero si solo se necesita la transpilación en los tests, es suficiente con instalar el paquete `@babel/plugin-transform-modules-commonjs` como dependencia de desarrollo:

```sh
npm i -D @babel/plugin-transform-modules-commonjs
```

Para que esté plugin funcione, es necesario configurar Babel en el fichero package.json

```json
  "babel": {
    "env": {
      "test": {
        "plugins": [
          "@babel/plugin-transform-modules-commonjs"
        ]
      }
    }
  }
```

### Configuración. ESLint. Uso de TypeScript

Si hemos añadido al proyecto ESLint, el linter de JavaScript, para que ESLint no de errores con las funciones de Jest, necesita indicar que Jest es un entorno de ejecución, añadiendo la propiedad `jest` al objeto `env` en la configuración de ESLint, que puede estar en el fichero `package.json` o en el fichero `.eslintrc.json`:

```json
{
  "env": {
    ...
    "jest": true
  },
  ...
}
```

Si nuestro proyecto está desarrollado en TypeScript, además de instalar Jest y los tipos de Jest como dependencias de desarrollo, añadiremos la instalación de `ts-jest` y `jest-ts-webcompat-resolver`, este último para resolver los módulos ES en Jest, por lo que dejará de ser necesario el plugin de Babel. Si ademas queremos la importación de módulos CSS o SCSS, añadiremos `identity-obj-proxy` como dependencia de desarrollo.

```bash
  npm i -D jest ts-jest @types/jest
  npm i -D jest-ts-webcompat-resolver
  npm i -D identity-obj-proxy
```

Finalmente hay que añadir un archivo de configuración `jest.config.js` en la raíz del proyecto:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: "ts-jest",
  // testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["dist"],
  resolver: "jest-ts-webcompat-resolver",
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
};
```

### Scripts de ejecución de los tests unitarios

Si observamos el fichero `package.json`, veremos que en la sección `scripts` hay un script de test que se ejecuta al ejecutar el comando `npm test`.

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Este script por defecto muestra el mensaje indicado y simula un fallo en los test al terminar con un código 1 (error), a nivel de sistema operativo. Jest, actúa de igual manera, termina con un código 0 (éxito) si todos los test pasan y con un código 1 si alguno falla, lo cual permite integrar los test en cualquier proceso automático como los que se utilizan en CI/CD.

Para ejecutar Jest, debemos modificar el script de test para que ejecute Jest con el conjunto de parámetros que nos interese, por ejemplo `coverage`. Además, podemos añadir otros scripts que nos permitan ejecutar Jest en modo `watch`, muy habitual para desarrollo, o en modo `watchAll`, que ejecuta todos los test cada vez que se modifica un archivo.

```json
  "scripts": {
    "test": "jest --coverage",
    "test:dev": "jest --watchAll",
  },
```

Cualquiera que sea el script que definamos,lo ejecutaremos en la terminal con el comando `npm run test` o `npm test` (para el comando test no hace falta usar 'run'), o con el comando `npm run test:dev`. En ambos casos, Jest buscará los test en la carpeta `__tests__` o en los archivos que tengan el sufijo `.test.js` o `.spec.js`.

Los comandos de Jest, además de las opciones que nos permiten personalizar la ejecución de los test, como por ejemplo `--coverage` o `--watch` , pueden terminar con una cadena de caracteres que se interpreta como una expresión regular que filtre los test que se van a ejecutar. Por ejemplo, si queremos ejecutar solo los test que contienen la palabra `utils` en el nombre, ejecutaríamos el siguiente comando:

```sh
npm test utils
npm run test:dev utils
```

## Estructura de los test unitarios con Jest

La estructura de los ficheros de test creados con Jest se corresponde con la que describíamos en la unidad anterior al referirnos a los test unitarios.
Cada fichero de test se encarga de verificar el correcto funcionamiento de una unidad de código, como una función o una clase, de forma aislada.

- Los test unitarios se agrupan en **test suites** que se definen con la función `describe`.
- Cada test unitario se corresponde con una función que se define con la palabra `it` o `test`, que representa un caso de prueba concreto de una función o un método de una clase
- Las aserciones se realizan con la función `expect` de Jest, que se encarga de comparar el valor esperado con el valor obtenido.
- La forma en que se lleva a cabo dicha comparación depende del matcher empleado: una función booleana que se encarga de comparar el valor esperado con el valor obtenido. Una de las funciones más comunes para realizar aserciones es la función `toBe`.

Veamos el ejemplo con la función `product` que multiplica dos números:

```js
// product.js
export function product(a, b) {
  return a + b;
}
```

```js
// product.test.js
import { prod } from "./prod";
describe("prod", () => {
  it("should return the prod of two numbers", () => {
    expect(product(1, 2)).toBe(3);
  });
});
```

Como hemos visto, la organización del código puede seguir distintos patrones, como el **patrón AAA** (Arrange, Act, Assert) o el **patrón Given-When-Then**.

El ejemplo anterior utilizando el patrón AAA sería:

```js
// product.test.js
import { prod } from "./prod";

describe("prod", () => {
  it("should return the prod of two numbers", () => {
    // Arrange
    const a = 1;
    const b = 2;
    const expected = 3;
    // Act
    const result = product(a, b);
    // Assert
    expect(result).toBe(expected);
  });
});
```

El mismo ejemplo utilizando el patrón Given-When-Then y diversos niveles de describe sería:

```js
// product.test.js
import { prod } from "./prod";
describe("Given product function", () => {
  describe("when we multiply two numbers, 2 and 3", () => {
    const a = 2;
    const b = 3;
    it("should return 6", () => {
      const expected = 6;
      const result = product(a, b);
      expect(result).toBe(expected);
    });
  });
});
```

En este caso, el patron Given-When-Then añade un nivel de abstracción a los test, que se corresponden con las distintas partes de la función que se está testando. Como cualquier abstracción, puede suponer mayor cantidad de código, pero también mayor claridad en la estructura de los test que se refleja cuando vemos la salida de los test en la terminal.

```sh
  Given product function
    when we multiply two numbers, 2 and 3
      √ should return 6
```

El uso de estos patrones puede cobrar mayor sentido en función de la complejidad del conjunto de test que se estén realizando, y de la cantidad de test que se estén realizando.

## Matchers de Jest

Jest proporciona una serie de funciones que nos permiten realizar aserciones en los test unitarios. Estas funciones se conocen como **matchers** y se utilizan para comparar el valor esperado con el valor obtenido en el test.

### Igualdad y veracidad

En este apartado se incluyen algunos de los matchers más comunes:

- `toBe`: Compara si dos valores son iguales utilizando el operador `===`. Solo debe usarse para comparar valores primitivos.
- `toEqual`: Compara si dos valores son iguales utilizando el algoritmo de comparación de objetos de JavaScript. Se utiliza para comparar objetos y arrays.
- `toBeNull`: Comprueba si un valor es `null`.
- `toBeUndefined`: Comprueba si un valor es `undefined`.
- `toBeDefined`: Comprueba si un valor está definido.
- `toBeTruthy`: Comprueba si un valor es verdadero, es decir, hace casting a true.
- `toBeFalsy`: Comprueba si un valor es falso, es decir hace casting a false.

Ejemplo de uso de matchers de igualdad y veracidad

```js
describe("Matchers de igualdad y veracidad", () => {
  it("toBe", () => {
    expect(1 + 2).toBe(3);
  });
  it("toEqual", () => {
    expect({ a: 1 }).toEqual({ a: 1 });
  });
  it("toBeNull", () => {
    expect(null).toBeNull();
  });
  it("toBeUndefined", () => {
    expect(undefined).toBeUndefined();
  });
  it("toBeDefined", () => {
    expect(1).toBeDefined();
  });
  it("toBeTruthy", () => {
    expect(true).toBeTruthy();
  });
  it("toBeFalsy", () => {
    expect(false).toBeFalsy();
  });
});
```

### Comparación de números

Entre los matchers específicos para valores de tipo number encontramos:

- `toBeGreaterThan`: Comprueba si un valor es mayor que otro.
- `toBeGreaterThanOrEqual`: Comprueba si un valor es mayor o igual que otro.
- `toBeLessThan`: Comprueba si un valor es menor que otro.
- `toBeLessThanOrEqual`: Comprueba si un valor es menor o igual que otro.
- `toBeCloseTo`: Comprueba si un valor es cercano a otro, con un margen de error.

Ejemplo de uso de matchers de comparación de números

```js
describe("Matchers de comparación de números", () => {
  it("toBeGreaterThan", () => {
    expect(3).toBeGreaterThan(2);
  });
  it("toBeGreaterThanOrEqual", () => {
    expect(3).toBeGreaterThanOrEqual(3);
  });
  it("toBeLessThan", () => {
    expect(2).toBeLessThan(3);
  });
  it("toBeLessThanOrEqual", () => {
    expect(2).toBeLessThanOrEqual(2);
  });
  it("toBeCloseTo", () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });
});
```

### Comparación de otros tipos de valores

Otros matchers disponibles par otros tipos de valores son:

- `toBeInstanceOf`: Comprueba si un valor es una instancia de una clase.
- `toMatch`: Comprueba si un valor coincide con una expresión regular.
- `toContain`: Comprueba si un valor contiene otro valor. Puede utilizarse con arrays y strings.
- `toHaveLength`: Comprueba si un valor tiene una longitud determinada. Puede utilizarse con arrays y strings.

Ejemplo de uso de matchers de comparación de otros tipos de valores

```js
describe("Matchers de comparación de otros tipos de valores", () => {
  it("toBeInstanceOf", () => {
    expect(new Date()).toBeInstanceOf(Date);
  });
  it("toMatch", () => {
    expect("abc").toMatch(/a/);
  });
  it("toContain", () => {
    expect([1, 2, 3]).toContain(2);
  });
  it("toHaveLength", () => {
    expect("abc").toHaveLength(3);
  });
});
```

### Excepciones y errores

El matchers para errores es

- `toThrow`: Comprueba si una función lanza una excepción.

Su variante `toThrowError` comprobaba si una función lanza una excepción con un mensaje determinado, pero ha sido deprecado en Jest 24.9.0.

En caso de los test de snapshot, Jest proporciona los siguientes matchers para errores:

- `toThrowErrorMatchingSnapshot`: Comprueba si una función lanza una excepción que coincide con un snapshot.
- `toThrowErrorMatchingInlineSnapshot`: Comprueba si una función lanza una excepción que coincide con un snapshot en línea.

Algunos ejemplos de uso de matchers para errores:

```js
const throwError = () => {
  throw new Error("Error");
};

function makePossibleError(n) {
  if (n > 1) {
    throw new Error("Error");
  }
}
describe("Matchers de errores", () => {
  it("toThrow", () => {
    expect(throwError).toThrow();
  });
  it("toThrow", () => {
    expect(() => makePossibleError(2)).toThrow();
  });
});
```

En los test de casos en las que una función lanzan un error, esta se pasa como **callback** al expect, para que Jest pueda capturar la excepción y comprobar si se ha lanzado. En el caso de la función `makePossibleError`, que necesita un argumento, se pasa como callback una función anónima que llama a `makePossibleError` con el argumento 2.

## Ejercicios

1. Crea una función `isEven` que recibe un número entero positivo y devuelve `true` si es par y `false` en caso contrario. Crea los test unitarios para la función `isEven` siguiendo la metodología TDD.
2. Crea una función `isPrime` que recibe un número entero positivo y devuelve `true` si es un número primo y `false` en caso contrario. Crea los test unitarios para la función `isPrime` siguiendo la metodología TDD.
3. Crea una función `fibonacci` que recibe un número entero positivo y devuelve el número de la serie de Fibonacci correspondiente. Crea los test unitarios para la función `fibonacci` siguiendo la metodología TDD.
4. Crea una función `isPalindrome` que recibe una cadena de texto y devuelve `true` si es un palíndromo y `false` en caso contrario. Crea los test unitarios para la función `isPalindrome` siguiendo la metodología TDD.
5. Función de ordenación usando TDD: Crea una función `sort` que recibe un array de números y devuelve un array con los números ordenados de menor a mayor. Crea los test unitarios para la función `sort` siguiendo la metodología TDD.

Para el caso de los array, podemos llevar a cabo un completo conjunto de ejercicios, creando un modulo con funciones que repliquen los siguientes métodos de array, sin utilizar ninguno de los métodos o propiedades ya existentes en el prototipo de Array:

- length,
- push,
- pop (puede usar length),
- unshift,
- shift (puede usar length),
- some,
- every,
- find,
- filter,
- map,
- findIndex,
- includes,
- indexOf,
- reduce,
- join

Cualquiera de tus funciones puede usar las que ya hayas creado. Crea los test unitarios para cada una de las funciones siguiendo la metodología TDD.

## Referencias

VIDEO: [Introducción al Testing desde Cero con JEST](https://www.youtube.com/watch?v=_DzBez4qMi0) por Midudev

VIDEO: [Introduction To Testing In JavaScript With Jest](https://www.youtube.com/watch?v=FgnxcUQ5vho) by Web Dev Simplified

- [Jest](https://jestjs.io/)
- [Test unitarios en Node.js con Jest](https://medium.com/@diego.coder/test-unitarios-en-javascript-con-jest-4f120f5e7124) por diego.coder26 (2022)
- [Jest Testing: A Helpful, Introductory Tutorial](https://www.testim.io/blog/jest-testing-a-helpful-introductory-tutorial/) by Testim (2022)

