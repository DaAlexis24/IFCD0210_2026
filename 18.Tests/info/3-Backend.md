# Tests unitarios en el backend

Al describir los test de un backend, como los que hemos aprendido a implementar con Node.js y la librería Express, podemos dividirlos en dos grandes grupos, que ya conocemos de la teoría de testing:

1. **Test unitarios**: Son aquellos que prueban una unidad de código, como una función o un método de una clase, de forma aislada. En el backend es habitual utilizar la orientación a objetos, por lo que es común testar clases. En este caso, se trata de testar los métodos de una clase de forma aislada, sin tener en cuenta el comportamiento de sus dependencias. Para ello, se suelen utilizar mocks como los ya mencionados para simular el comportamiento de las dependencias de la unidad de código que estamos probando.
2. **Test de integración**: Son aquellos que prueban la interacción entre diferentes unidades de código, como por ejemplo, la interacción entre diferentes clases o entre diferentes módulos de una aplicación. En este caso podemos testar el comportamiento integro de cada una de las diferentes rutas de nuestra API REST, ayudándonos para ello de la librería SuperTest.

La **testabilidad** del backend depende de los **patrones** que hayamos empleado a la hora de desarrollar nuestra aplicación. Por ejemplo, si hemos seguido el principio **separación por capas** y de **responsabilidad única**, será más fácil testar cada una de las unidades de código de forma **aislada**. Por otro lado, si hemos seguido el principio de **inyección de dependencias**, será muy fácil disponer de mocks para evitar las interferencias entre diferentes unidades de código. A la hora detestar las distintas capas de la aplicación de forma aislada, veremos que es imprescindible utilizar **mocks** para simular el comportamiento de las dependencias de cada capa.

Una de las características del backend es el carácter **asíncrono** de muchas de sus operaciones, como las llamadas a bases de datos o a servicios externos. Por ello, es importante tener en cuenta la forma de testar estas operaciones asíncronas, utilizando las diferentes formas que nos proporciona JavaScript para manejar la asincronía, como los **callbacks**, las **promesas** o las **funciones async/await**.

Por otro lado es muy frecuente que el backend se programe utilizando en mayor o menor medida **programación orientada a objetos**. En este caso, es importante saber cómo testar las clases y los métodos de las clases.

## Asincronía en los test unitarios

En aplicaciones en JavaScript, muchas funciones son asíncronas, como las llamadas a APIs. Jest proporciona la posibilidad de tester las diferentes formas de manejar las operaciones asíncronas, propias del lenguaje como los callbacks, las promesas o las funciones async/await.

### Callbacks

Supongamos que tienes una función fetchData que toma un callback y lo llama con los datos después de una operación asíncrona.

```js
// fetchData.js
export function fetchData(callback) {
  setTimeout(() => {
    callback("sample data");
  }, 1000);
}
```

```js
// fetchData.test.js
import { fetchData } from "./fetchData";
test("los datos son sample data", (done) => {
  function callback(data) {
    expect(data).toBe("sample data");
    done();
  }
  fetchData(callback);
});
```

### Promesas

Si una función devuelve una promesa, se puede usar .then y .catch para manejar la aserción, de forma similar a como se consumiría la promesa en el código.

```js
// fetchDataPromise.js
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("sample data");
    }, 1000);
  });
}
```

```js
// fetchDataPromise.test.js
import { fetchData } from "./fetchDataPromise";
test("los datos son sample data", () => {
  return fetchData().then((data) => {
    expect(data).toBe("sample data");
  });
});
```

#### Async/Await

Jest también soporta async / await , lo que hace que las pruebas asíncronas sean más legibles. Jest espera a que se resuelva la promesa devuelta por la función async antes de considerar que el test ha terminado. Esta es la forma habitual en que se escriben los test que incluyen promesas.

```js
// fetchDataPromise.test.js con async/await
import { fetchData } from "./fetchDataPromise";
test("los datos son sample data", async () => {
  const data = await fetchData();
  expect(data).toBe("sample data");
});
```

#### Promesas rechazadas

Para testar promesas rechazadas, se puede usar el método .catch o el método .rejects de expect. La segunda de las opciones es más específica de Jest y proporciona una sintaxis más clara.

```js
// fetchDataPromiseRejected.js
function fetchDataRejected() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("error");
    }, 1000);
  });
}
```

```js
// fetchDataPromiseRejected.test.js
import { fetchDataRejected } from "./fetchDataPromiseRejected";
test("la promesa es rechazada", () => {
  return expect(fetchDataRejected()).rejects.toBe("error");
});
```

## Mocks y Spies. Matches específicos

Jest proporciona una serie de funciones que nos permiten crear mocks y spies, que como ya hemos explicado, nos permiten simular el comportamiento de las funciones y métodos que se utilizan en los test unitarios.

Mocking es una técnica fundamental en las pruebas unitarias y de integración, donde se simulan partes del sistema que no son el foco
de la prueba, permitiendo así aislar y controlar el comportamiento de las unidades bajo prueba.

### Mocking de Funciones

Para crear un mock de función en Jest, se utiliza jest.fn().
Este método crea una función simulada que puedes controlar y observar durante tus pruebas. Por ejemplo:

```js
const myMock = jest.fn();`
```

Por defecto, el mock creado inicialmente carece de ninguna implementación, por lo que no hace nada cuando se le llama, limitándose a devolver undefined, como corresponde a cualquier función void. Sin embargo, el mock incluye numerosos métodos que permiten configurar su comportamiento.

El más genérico de estos métodos es `mockImplementation(fn)`, que permite definir la implementación de la función simulada, junto con su variante `mockImplementationOnce(fn)` que permite definir la implementación que ejecutará el mock la primera vez que se le llame.

Existen además varios atajos para configurar el comportamiento de un mock especificando únicamente su resultado:

- `mockReturnValue(value)`: Configura el valor que devolverá el mock cuando se le llame.
- `mockReturnValueOnce(value)`: Configura el valor que devolverá el mock la primera vez que se le llame.
- `mockResolvedValue(value)`: Configura el valor que devolverá el mock cuando se le llame, en el caso de que devuelva una promesa.
- `mockResolvedValueOnce(value)`: Configura el valor que devolverá el mock la primera vez que se le llame, en el caso de que devuelva una promesa.
- `mockRejectedValue(value)`: Configura el valor que devolverá el mock cuando se le llame, en el caso de que devuelva una promesa rechazada.
- `mockRejectedValueOnce(value)`: Configura el valor que devolverá el mock la primera vez que se le llame, en el caso de que devuelva una promesa rechazada.

Por ejemplo:

```js
myMock.mockReturnValueOnce(10).mockReturnValueOnce("x").mockReturnValue(true);
```

En este caso, myMock() devolverá secuencialmente 10 , luego 'x' , y después true en las primeras tres llamadas, y luego true
para todas las llamadas subsiguientes.

#### Verificación de Llamadas

Jest proporciona una serie de métodos que permiten verificar cómo se ha utilizado un mock, cuántas veces se ha llamado y con qué argumentos. Es decir, nos permiten 'espiar' el mock y hacer **assertions** sobre su comportamiento.

- `toBeCalled()`: Verifica si la función simulada fue llamada al menos una vez.
- `toHaveBeenCalledTimes(n)`: Verifica si la función simulada fue llamada exactamente n veces.
- `toHaveBeenLastCalledWith(arg1, arg2, ...)`: Verifica si la última llamada a la función simulada fue con los argumentos especificados.
- `toHaveBeenNthCalledWith(n, arg1, arg2, ...)`: Verifica si la llamada enésima a la función simulada fue con los argumentos especificados.
- `toHaveBeenLastCalledWith(arg1, arg2, ...)`: Verifica si la última llamada a la función simulada fue con los argumentos especificados.
- `toHaveBeenNthCalledWith(n, arg1, arg2, ...)`: Verifica si la llamada enésima a la función simulada fue con los argumentos especificados.
- `toHaveReturned()`: Verifica si la función simulada devolvió un valor.
- `toHaveReturnedTimes(n)`: Verifica cuántas veces la función simulada devolvió un valor.
- `toHaveReturnedWith(value)`: Verifica si la función simulada devolvió un valor específico.
- `toHaveLastReturnedWith(value)`: Verifica si la última vez que la función simulada devolvió un valor específico.
- `toHaveNthReturnedWith(n, value)`: Verifica si la enésima vez que la función simulada devolvió un valor específico.

Los más utilizados entre ellos son toBeCalled , toHaveBeenCalledWith , toHaveBeenLastCalledWith

### Mocking de Módulos

Jest permite simular módulos enteros mediante `jest.mock('path-del-modulo')`, lo que cambia el comportamiento de todas las funciones y clases que exporta el módulo simulado. Esto es especialmente útil cuando deseas simular el comportamiento de dependencias externas como librerías o módulos que realizan operaciones de entrada/salida.

Por ejemplo, si queremos simular el comportamiento de la función `fetchData` que hemos visto anteriormente, podemos hacerlo de la siguiente manera:

```js
jest.mock("./fetchData");
```

Una vez que hemos simulado el módulo, podemos configurar el comportamiento de las funciones y clases que exporta el módulo simulado utilizando `mockImplementation` o `mockReturnValue`.

```js
import { fetchData } from "./fetchData";
jest.mock("./fetchData");

fetchData.mockImplementation(() => Promise.resolve("sample data"));
```

En otro ejemplo, podemos ver como se simula el comportamiento de una librería de terceros, como `axios`, que se utiliza para realizar peticiones HTTP:

```js
// getUser.js
import axios from "axios";

async function getUser(userId) {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
}
```

```js
// getUser.test.js
import axios from "axios";
import { getUser } from "./getUser";

jest.mock("axios");

test("debería obtener el usuario", async () => {
  const user = { name: "John Doe" };
  axios.get.mockResolvedValue({ data: user });
  const result = await getUser(1);
  expect(result).toEqual(user);
  expect(axios.get).toHaveBeenCalledTimes(1);
});
```

### Spies en Jest

Jest proporciona una serie de funciones que nos permiten crear spies, que son funciones que nos permiten observar cómo se utilizan otras funciones y métodos en los test unitarios.

- `const spy = jest.spyOn(object, methodName)`: Crea un spy para el método methodName del objeto object.

Por defecto los spies no alteran el comportamiento de las funciones y métodos que espían, pero podemos configurarlos para que devuelvan un valor específico o para que ejecuten una función específica, con lo que estaríamos pasando al terreno de los mocks.

Por ejemplo, si queremos crear un spy para el método play del objeto vídeo, podemos hacerlo de la siguiente manera:

```js
// video.js
const video = {
  play() {
    return true;
  },
};
```

```js
// video.test.js
test("plays video", () => {
  const spy = jest.spyOn(video, "play");
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);
});

test("bad plays video", () => {
  const spy = jest.spyOn(video, "play");
  spy.mockReturnValue(false);
  const isPlaying = video.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(false);
});
```

Como vemos, el primer test se limita a espiar el método play del objeto video, mientras que el segundo test configura el spy para que devuelva false cuando se llame a video.play, es decir que se comporta como um mock.

## Testing de aplicaciones orientadas a objetos: Test de clases

La forma de testar clases en JavaScript es similar a la de testar funciones. En este caso, lo que hacemos es instanciar la clase que queremos testar y llamar a sus métodos, comprobando que el resultado es el esperado. Para ello, podemos utilizar Jest, que nos permite testar clases de la misma forma que testamos funciones.

### Test de la capa repository

Una de las capas más comunes en una aplicación backend es la capa de acceso a datos, que suele ser la capa repository. En esta capa se suelen implementar los métodos para acceder a la base de datos, como por ejemplo, los métodos para insertar, actualizar, borrar o consultar registros en una tabla de la base de datos.

A la hora de testar los métodos de la clase que implementa esta capa, debemos tratarlos de forma aislada, sin utilizar las dependencias reales de esta clase, incluyendo su interacción con la DB, por lo general mediante un ORM como Sequelize o un ODM como Mongoose. Para ello, utilizamos **mocks** para simular el comportamiento de las dependencias de la clase que estamos testando.

Tomemos como ejemplo una clase que implementa la capa repository de una aplicación de notas, que utiliza un ORM como Mongoose para acceder a la base de datos. En este ORM, los modelos se definen como clases, que implementan los métodos necesarios para interaccionar con la DB. El repositorio es también una clase que define los métodos necesarios para completar el CRUD de la entidad que representa. En este caso, vamos a testar el método getAll de la clase NotesMongoRepo, que devuelve todas las notas de la base de datos.

```js
// notes.mongo.model.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

export const NoteModel = mongoose.model("Note", noteSchema);
```

```js
// notes.mongo.repo.js
import { NoteModel } from './notes.mongo.model.js';

export class NotesMongoRepo {
  constructor() {
    // this.userRepo = new UsersMongoRepo();
  }

  async getAll() {
    const result = await NoteModel.find().exec();
    return result;
  }
```

Si nos detenemos en el método getAll, vemos que utiliza el método find de NoteModel, que es un método de Mongoose que devuelve una Query con todas las notas de la base de datos. En esta Query, se encadenan otros métodos como exec, que se utilizan para obtener una promesa con los datos de las notas.

Para testar este método, necesitamos simular el comportamiento de NoteModel.find, ya que no queremos que el test dependa de la base de datos.

```js
import { NotesMongoRepo } from "./notes.mongo.repo.js";
import { NoteModel } from "./notes.mongo.model.js";

jest.mock("./notes.mongo.model.js");

describe("NotesMongoRepo", () => {
  describe("getAll", () => {
    it("should return all notes", async () => {
      const notes = [
        { title: "note 1", content: "content 1" },
        { title: "note 2", content: "content 2" },
      ];
      NoteModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(notes),
      });
      const repo = new NotesMongoRepo();
      const result = await repo.getAll();
      expect(result).toEqual(notes);
      expect(NoteModel.find).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Test de la capa controller

Otra de las capas más comunes en una aplicación backend es la capa controller, que se encarga de gestionar las peticiones HTTP y de llamar a los métodos de la capa repo para realizar las operaciones necesarias. En esta capa, se suelen implementar los métodos para gestionar las rutas de la API REST, como por ejemplo, los métodos para obtener, crear, actualizar o borrar registros de la base de datos.

Por ejemplo, vamos a testar el método getAll de la clase NotesController, que devuelve todas las notas de la base de datos.

```js
// notes.controller.js
import { NotesMongoRepo } from "./notes.mongo.repo.js";

export class NotesController {
  constructor() {
    this.repo = new NotesMongoRepo();
  }

  async getAll(_req, res, next) {
    try {
      const result = await this.repo.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
```

#### Mocks de métodos de clases: utilizando prototypes

En el test de la capa controller, necesitamos simular el comportamiento del método getAll de la capa repo, ya que no queremos que el test dependa de la base de datos. Para ello, utilizamos mocks para simular el comportamiento de la clase NotesMongoRepo.

```js
// notes.controller.test.js

import { NotesController } from "./notes.controller.js";
import { NotesMongoRepo } from "./notes.mongo.repo.js";

// jest.mock("./notes.mongo.repo.js");

describe("NotesController", () => {
  describe("getAll", () => {
    it("should return all notes", async () => {
      const notes = [
        { title: "note 1", content: "content 1" },
        { title: "note 2", content: "content 2" },
      ];
      NotesMongoRepo.prototype.getAll = jest.fn().mockResolvedValue(notes);
      const controller = new NotesController();
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      await controller.getAll(req, res, next);
      expect(res.json).toHaveBeenCalledWith(notes);
    });
  });
});
```

No es necesario utilizar `jest.mock` para crear el mock del módulo del que importamos NotesMongoRepo, ya que podemos hacerlo directamente utilizando `NotesMongoRepo.prototype.getAll = jest.fn().mockResolvedValue(notes);`. De esta forma, estamos cambiando en el prototipo de la clase la función que será invocada desde cualquiera de las instancias.

## Ejercicios

1. **Test de una función asíncrona**: Crea una función asíncrona que reciba un número y devuelva una promesa que resuelva con el doble de ese número. Testa la función utilizando Jest.
2. **Test de una clase**: Crea una clase que represente un círculo, con un método que calcule el área del círculo. Testa la clase utilizando Jest.
3. **Test de una capa repository**: Crea una clase que implemente la capa repository de una aplicación de notas, con un método que devuelva una nota de la base de datos, indicada como parámetro. Testa el método utilizando Jest.
4. **Test de una capa controller**: Crea una clase que implemente la capa controller de una aplicación de notas, con un método que devuelva una nota de la base de datos, indicada por parámetros. Testa el método utilizando Jest.

Observa que no hemos completado la aplicación del backend: no hay aplicación express ni rutas ni conexión a la bases de datos

## Referencias

VIDEO: [JavaScript Testing with Jest – Crash Course](https://www.youtube.com/watch?v=IPiUDhwnZxA)

- [Jest - Documentación oficial](https://jestjs.io/docs/en/getting-started)
- [Aprende cómo aplicar Jest Mock paso a paso fácil y sin dolor](https://developero.io/blog/jest-mock-module-function-class-promises-axios-y-mas) por Developero
- [Jest Mocking for Unit Testing](https://codestax.medium.com/jest-mocking-for-unit-testing-33d16289df06) by CodeStax (2024)
- [Server-Side Testing with Jest](https://dev.to/eetukudo_/server-side-testing-with-jest-1pj) by Emmanuel Eetukudo (2021)
