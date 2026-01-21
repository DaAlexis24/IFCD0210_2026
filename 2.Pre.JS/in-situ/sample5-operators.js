// - operadores de asignación

const x = 22;

// - operadores aritméticos

let result;
result = 2 + 2;
result = 2 - 2;
result = 2 * 2;
result = 3 / 2;
result = 3 & 2; // módulo de la división o resto
result = 3 ** 3; // elevado a

// - operadores de asignación + aritméticos

let a = 2;
// a = a + 3
a += 3;

// - operadores unarios

a++;
a--;
// a = a + 1
// a += 1

// - operadores de cadena (string)

const text = 'Pepe' + ' ' + 'Pérez';

// - operadores de comparación -  Igualdad

{
    const foo = 3;
    const bar = 4;
    console.log(3 == foo); // true
    console.log('3' == foo); // true
    console.log(3 == '3'); // true
    console.log(foo != 4); // true
    console.log(bar != '3'); // true
    // Igualdad estricta
    console.log(3 === foo); // true
    console.log(foo !== '3'); // true
    console.log(3 !== '3'); // true
    console.log(undefined === undefined);
    console.log(null === null);
}

// Los NaN
{
    const x = Number('Pepe');
    console.log('¿x vale NaN?', isNaN(x));
    console.log(typeof x);
}


// Los ceros

{
    const x = 0
    const y = -0
    console.log('Comparando con signo', x === y)
}

// - operadores de comparación - otros
{
    const foo = 3;
    const bar = 4;
    console.log(bar > foo); // true
    console.log('12' > 2); // true
    console.log(bar >= foo); // true
    console.log(foo >= 3); // true
    console.log(foo < bar); // true
    console.log('2' < 12); // true
    console.log(foo <= bar); // true
}

// - operadores bit a bit
// No vamos a ver 

// - operadores lógicos
// - operador condicional (ternario)
// - operador coma
// - operadores relacionales
