# Práctica: Test de funciones y TDD

## Función factorial usando TDD

Vamos a crear una función que calcule el factorial de un número, siguiendo la metodología TDD. Para ello, vamos a seguir los siguientes pasos:

1. Crear un fichero `factorial.js` en el que vamos a implementar la función `factorial` que calcula el factorial de un número.
2. Crear un fichero `factorial.test.js` en el que vamos a escribir los test unitarios para la función `factorial`.
3. El primer test unitario que vamos a escribir es un test que comprueba que el **factorial de 0 es 1**.
4. Ejecutar los test unitarios con Jest para comprobar que la función `factorial` NO funciona correctamente, ya que aún ni existe (RED).
5. Implementar la función `factorial` para que pase el primero de los test unitarios (REFACTOR).

   ```js
   export function factorial(n) {
     return 1;
   }
   ```

6. Volver a ejecutar los test unitarios para comprobar que la función `factorial` pasa los test (GREEN).
7. Escribir un segundo test unitario que comprueba que el **factorial de 1 es 1**.
8. Volver a ejecutar los test unitarios para comprobar que la función `factorial` NO pasa el test (RED).
9. Refactorizar el código para este segundo caso de uso (REFACTOR).

   ```js
   export function factorial(n) {
     if (n === 0 || n === 1) {
       return 1;
     }
     return n;
   }
   ```

10. Volver a ejecutar los test unitarios para comprobar que la función `factorial` pasa los test (GREEN).
11. Escribir un tercer test unitario que comprueba que el **factorial de 2 es 2**.
12. Volvemos a ejecutar los test unitarios para comprobar que la función `factorial` pasa el test (GREEN).
13. Escribir un nuevo test unitario que comprueba que el **factorial de 5 es 120**.
14. Volvemos a ejecutar los test unitarios para comprobar que la función `factorial` NO pasa el test (RED).
15. Refactorizar el código para este nuevo caso de uso (REFACTOR).

    ```js
    export function factorial(n) {
      let r = 1;
      for (let i = 2; i <= p; i++) {
        r *= i;
      }
      return r;
    }
    ```

16. Volvemos a ejecutar los test unitarios para comprobar que la función `factorial` pasa el test (GREEN).

En este momento tendremos el siguiente código en los ficheros `factorial.js` y `factorial.test.js`:

```js
// factorial.js
export function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) {
    r *= i;
  }
  return r;
}
```

```js
// factorial.test.js
import { factorial } from "./factorial";

describe("factorial", () => {
  it("should return 1 when n is 0", () => {
    expect(factorial(0)).toBe(1);
  });
  it("should return 1 when n is 1", () => {
    expect(factorial(1)).toBe(1);
  });
  it("should return 2 when n is 2", () => {
    expect(factorial(2)).toBe(2);
  });
  it("should return 120 when n is 5", () => {
    expect(factorial(5)).toBe(120);
  });
});
```

## Automatizando casos de uso

En lugar de escribir un test unitario para cada caso de uso, podemos automatizar la creación de los test unitarios.
Podría hacerse utilizando un bucle `for` que recorra un array de casos de uso pero Jest proporciona una función `test.each` que permite definir una tabla de casos de uso y ejecutar un test unitario para cada uno de ellos.

La tabla de casos de uso se puede definir como un array de arrays, donde cada array contiene los argumentos de entrada y el valor esperado.

```js
// factorial.test.js
import { factorial } from "./factorial";

describe("factorial", () => {
  test.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [5, 120],
  ])("should return %i when n is %i", (n, expected) => {
    expect(factorial(n)).toBe(expected);
  });
});
```

Otra posibilidad es que la tabla de casos sea un array de objetos, donde cada objeto es un caso de uso y sus propiedades son los argumentos de entrada y el valor esperado.

```js
// factorial.test.js
import { factorial } from "./factorial";

describe("factorial", () => {
  test.each([
    { n: 0, expected: 1 },
    { n: 1, expected: 1 },
    { n: 2, expected: 2 },
    { n: 5, expected: 120 },
  ])("should return %i when n is %i", ({ n, expected }) => {
    expect(factorial(n)).toBe(expected);
  });
});
```

## Casos de uso extremos (corner cases) y casos de uso límite (boundary cases)

Los casos de uso extremos (corner cases) y los casos de uso límite (boundary cases) de una función o un método son aquellos en los que la función o el método se comporta de forma diferente a como lo hace en los casos normales, por ejemplo lanzando errores o algún tipo de mensaje.

Siguiendo con nuestro ejemplo, las matemáticas nos dicen que solo existen factoriales de los números naturales, por lo que el factorial de un número negativo no tiene sentido. En este caso, la función `factorial` informar de ello de alguna manera, por ejemplo lanzando un error. Otras opciones podrían ser devolver null o un mensaje de texto, aunque con ello se perdería el tipado único de la función, es decir que no siempre devolvería un número.

```js
// factorial.test..js
test("it should throw an error when argument is -5", () => {
  const x = -5;
  const expected = "Numero negativo";

  expect(() => factorial(x)).toThrow(expected);
});

test("it should throw an error when argument is 5.5", () => {
  const x = 5.5;
  const expected = "Numero decimal";
  expect(() => factorial(x)).toThrow(expected);
});
```

En este punto podríamos abordar una mayor refactorización al hilo de un patron de diseño conocido como **single responsibility** (la S del acrónimo SOLID), que nos permitiría separar la responsabilidad de la función `factorial` en dos funciones, una que se encargue de calcular el factorial y otra que se encargue de comprobar si el argumento es válido.

```js
// factorial.js
export function factorial(n) {
  if (!isNatural(n)) {
    throw new Error("Invalid argument");
  }
  let r = 1;
  for (let i = 2; i <= n; i++) {
    r *= i;
  }
  return r;
}

function isNatural(n) {
  return Number.isInteger(n) && n >= 0;
}
```

Otro corner case sería el factorial de un número mayor que 170, que de un valor tan grande que desborda el rango de los números enteros que puede manipular JS. En este caso, el lenguaje, de forma nativa devuelve un valor especial de tipo number, denominado `Infinity`. Sería una decisión de diseño si queremos que nuestra función devuelva este valor o si queremos lanzar un error.

En el primer caso, el test unitario sería:

```js
test("it should return Infinity when argument is 171", () => {
  const x = 171;
  const expected = Infinity;
  expect(factorial(x)).toBe(expected);
});
```

En el segundo caso, el test unitario sería:

```js
test("it should throw an error when argument is 171", () => {
  const x = 171;
  const expected = "Numero demasiado grande";
  expect(() => factorial(x)).toThrow(expected);
});
```

Por último, no estamos teniendo en cuenta el conjunto de casos en los que el argumento no es un número, sino un string, un booleano, un array, un objeto, etc. En estos casos, la función `factorial` debería lanzar un error, ya que no puede calcular el factorial de un valor que no es un número.

```js
test("it should throw an error when argument is a string", () => {
  const x = "5";
  const expected = "Invalid argument";
  expect(() => factorial(x)).toThrow(expected);
});
```

De nuevo podemos adoptar la misma perpectiva de diseño que en el caso de los números no naturales, y separar la responsabilidad de la función `factorial` en dos funciones, una que se encargue de calcular el factorial y otra que se encargue de comprobar si el argumento es válido.

```js
// factorial.js
export function factorial(n) {
  if (!isValidLikeNumber(n)) {
    throw new Error("Invalid argument");
  }
  if (!isNatural(n)) {
    throw new Error("Invalid argument");
  }
  if (n > 170) {
    throw new Error("Numero demasiado grande");
  }
  let r = 1;
  for (let i = 2; i <= n; i++) {
    r *= i;
  }
  return r;
}
```

```js
function isValidLikeNumber(n) {
  return typeof n === "number" && !isNaN(n);
}
```
