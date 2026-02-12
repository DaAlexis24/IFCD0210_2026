// Objeto

// un dato no primitivo (referenciado)
// que incluye propiedades asociadas a otros datos

const user = {
    name: 'Pepe',
    age: 33,
}

user.job = 'Developer'
console.log(user)

// Funciones

// conjuntos de instrucciones
// que ejecuto cunado quiero
// normalmente invocandolas por su nombre

function make() {
    const x = 22;
    console.log(x);
}

// ADEMAS: una función es un OBJETO

make.age = function () {
    console.log('Estoy un poco desconcertado')
};

console.log(make);
make()
make.age()
