// Sentencias y expresiones

let n = 5 * 5;

console.log(5 * 5);
console.log(25);
console.log(n);

// Expresiones:
// Datos
// Variables
// Operadores

// Datos: string

let firstName = 'Pepe';
let surname = 'Pérez';

let userName = firstName + ' ' + surname;
console.log(userName);

// Template string

let formatName = `
    Pepe
    Peréz
`;
console.log(formatName);

let fullName = `${firstName} ${surname}`;

console.log(fullName);

// Opeardores aritméticos

let result;
result = 2 + 2;
result = 2 - 2;
result = 2 * 2;
result = 3 / 2;
result = 3 & 2; // módulo de la división o resto

const a = '2';

console.log(a + 2 + 2);
// a -> string
// +
// 2 -> '2' // coercion o casting automático
// '22'

console.log(2 + 2 + '2');

console.log(Number(a) + 2); // casting

console.log(a - 2);

const b = '2';
console.log(typeof b); // -> string
console.log(Number(b) + 2); // casting
console.log(typeof b); // -> string

let c = '2';
console.log(typeof c); // -> string
c = Number(c); // casting + reasignación
console.log(c + 2); 
console.log(typeof c); // -> number

// Numbers

console.log(0/12) // 0
console.log(12/0) // Infinito
console.log(-12/0)
console.log(0/0) // NaN

console.log("Pepe" - 2) 


// Corción de booleans

// Falsies -> coerción a false

console.log(Boolean(false))
console.log(Boolean(0))
console.log(Boolean(-0))
console.log(Boolean(0n))
console.log(Boolean(undefined))
console.log(Boolean(null))
console.log(Boolean(''))
console.log(Boolean(NaN))

// Truthies -> coerción a true
console.log('------------------------')
console.log(Boolean(true))
console.log(Boolean(22))
console.log(Boolean('Pepe'))
console.log(Boolean({}))
console.log(Boolean([]))
